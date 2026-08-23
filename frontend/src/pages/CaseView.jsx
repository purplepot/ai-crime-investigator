import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCaseStore } from '../stores/caseStore';
import { useApi } from '../hooks/useApi';
import { useWebSocket } from '../hooks/useWebSocket';
import CaseHeader from '../components/CaseHeader';
import AgentChat from '../components/AgentChat';
import InvestigationState from '../components/InvestigationState';
import NextAction from '../components/NextAction';
import EvidenceCard from '../components/EvidenceCard';
import SuspectCard from '../components/SuspectCard';
import TimelineView from '../components/TimelineView';
import AddEvidenceModal from '../components/AddEvidenceModal';
import AgentGraph from '../components/AgentGraph';
import { MessageSquare, FileText, User, Clock, AlertTriangle, Network } from 'lucide-react';

export default function CaseView() {
  const { id } = useParams();
  const { currentCase, messages, actions, evidence, suspects, timeline, setMessages, setActions, updateCaseState } = useCaseStore();
  const roster = useCaseStore(state => state.roster);
  const { fetchCase, fetchCaseData, startInvestigation, addEvidence } = useApi();
  useWebSocket(id);

  const [activeTab, setActiveTab] = useState('chat');
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isRerunning, setIsRerunning] = useState(false);

  useEffect(() => {
    fetchCase(id);
    fetchCaseData(id);
  }, [id, fetchCase, fetchCaseData]);

  if (!currentCase) return <div className="p-6 text-text-secondary">Loading...</div>;

  const handleStart = async () => {
    setIsRerunning(true);
    setMessages([]);
    setActions([]);
    updateCaseState({
      status: 'ACTIVE', current_stage: 'INITIAL_ANALYSIS', confidence: 0,
      next_action: null, recommendedAction: null, known_facts: [], unknowns: [], contradictions: []
    });
    try {
      await startInvestigation(id);
    } finally {
      setIsRerunning(false);
    }
  };
  const handleAddEvidence = async (data) => {
    await addEvidence(id, data);
    setShowEvidenceModal(false);
    fetchCaseData(id);
  };
  const fallbackAction = currentCase.status === 'BLOCKED' ? {
    action_type: 'VERIFY_ALIBI',
    target: 'Unverified suspect timeline',
    reason: 'The prior investigation did not preserve its recommendation. Re-run the analysis to regenerate the full agent review.',
    priority: 'HIGH'
  } : null;
  const nextAction = currentCase.next_action || currentCase.recommendedAction || actions[0] || fallbackAction;

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'evidence', label: 'Evidence', icon: FileText },
    { id: 'suspects', label: 'Suspects', icon: User },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <CaseHeader caseItem={currentCase} />
      
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] overflow-hidden">
        {/* LEFT COLUMN */}
        <section className="flex flex-col h-full min-h-0 min-w-0 p-5 lg:border-r border-border overflow-hidden">
          <div className="flex gap-1 mb-4 overflow-x-auto custom-scrollbar border-b border-border shrink-0">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-3 py-2.5 border-b-2 -mb-px text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === t.id ? 'border-text-primary text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>
          
          <div className="flex-1 min-h-0 relative overflow-hidden">
            {activeTab === 'chat' && (
              <AgentChat 
                messages={selectedAgent ? messages.filter(m => {
                  const key = String(selectedAgent).toLowerCase().replace(/\s+/g, '_');
                  const msgAgent = String(m.agent_id || m.agent_name || '').toLowerCase().replace(/\s+/g, '_');
                  return msgAgent === key || (m.agent_id && m.agent_id === selectedAgent);
                }) : messages} 
                caseItem={currentCase}
                onStart={handleStart}
              />
            )}
            {activeTab === 'network' && <AgentGraph roster={roster} selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} activeAgents={messages.slice(-3).map(m => m.agent_id || m.agent_name)} messages={messages} />}
            {activeTab === 'evidence' && (
              <div className="h-full flex flex-col overflow-hidden bg-surface border border-border rounded-md p-5">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted mb-1">Investigation records</p>
                    <h3 className="font-semibold text-sm">Evidence Registry</h3>
                  </div>
                  <button onClick={()=>setShowEvidenceModal(true)} className="border border-border text-text-primary hover:border-text-secondary hover:bg-surface-hover px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors">+ Submit Evidence</button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evidence.map(e => <EvidenceCard key={e.id} evidence={e} />)}
                    {evidence.length === 0 && <div className="col-span-2 text-text-muted italic text-sm py-4">No evidence collected.</div>}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'suspects' && (
              <div className="h-full flex flex-col overflow-hidden bg-surface border border-border rounded-md p-5">
                <div className="mb-4 shrink-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted mb-1">Key individuals</p>
                  <h3 className="font-semibold text-sm">Persons of Interest</h3>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suspects.map(s => <SuspectCard key={s.id} suspect={s} />)}
                    {suspects.length === 0 && <div className="col-span-2 text-text-muted italic text-sm py-4">No suspects identified.</div>}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'timeline' && <TimelineView timeline={timeline} />}
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <aside className="min-h-0 overflow-y-auto custom-scrollbar p-5 bg-surface border-t lg:border-t-0 border-border flex flex-col gap-4">
          
          {currentCase.status === 'CREATED' && (
            <button onClick={handleStart} className="w-full bg-text-primary text-primary font-bold py-3 rounded-md mb-2 hover:bg-text-secondary transition-colors text-xs uppercase tracking-wider">
              INITIATE INVESTIGATION
            </button>
          )}

          {currentCase.status === 'BLOCKED' && nextAction && (
            <NextAction action={nextAction} />
          )}

          {currentCase.status === 'BLOCKED' && nextAction && (
            <button onClick={()=>setShowEvidenceModal(true)} className="w-full bg-text-primary text-primary font-bold py-3 rounded-md hover:bg-text-secondary transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
              <AlertTriangle size={16}/> SUBMIT REQUIRED EVIDENCE
            </button>
          )}

          {(currentCase.status === 'BLOCKED' || currentCase.status === 'ACTIVE') && (
            <button disabled={isRerunning} onClick={handleStart} className="w-full border border-border text-text-primary font-semibold py-2.5 rounded-sm text-xs uppercase tracking-wider hover:border-text-secondary hover:bg-surface-hover disabled:opacity-50 transition-colors">
              {isRerunning ? 'Starting fresh analysis…' : currentCase.status === 'ACTIVE' ? 'Restart investigation' : 'Re-run investigation'}
            </button>
          )}

          <div className="flex-1 min-h-0">
            <InvestigationState caseItem={currentCase} />
          </div>
        </aside>
      </div>

      {showEvidenceModal && <AddEvidenceModal onClose={() => setShowEvidenceModal(false)} onSubmit={handleAddEvidence} />}
    </div>
  );
}
