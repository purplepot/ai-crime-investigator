import React, { useEffect, useRef } from 'react';
import AgentMessage from './AgentMessage';
import { useCaseStore } from '../stores/caseStore';
import { X, Filter } from 'lucide-react';

export default function AgentChat({ messages, totalMessagesCount, selectedAgent, onClearFilter, caseItem, onStart }) {
  const messagesRef = useRef(null);
  const roster = useCaseStore(state => state.roster);

  useEffect(() => {
    const panel = messagesRef.current;
    if (panel) panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const selectedAgentData = selectedAgent ? (roster || []).find(r => 
    r.agent_key === String(selectedAgent).toLowerCase().replace(/\s+/g, '_')
  ) : null;

  const filterLabel = selectedAgentData ? selectedAgentData.display_name : selectedAgent;

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between shrink-0 bg-surface">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted mb-0.5">Case communication</p>
            <h3 className="text-sm font-semibold">Swarm chat</h3>
          </div>

          {selectedAgent && (
            <div className="flex items-center gap-1.5 bg-surface-hover border border-border px-2.5 py-1 rounded text-xs text-text-secondary">
              <Filter size={11} className="text-accent-blue" />
              <span>Filtered: <strong className="text-text-primary">{filterLabel}</strong></span>
              <button 
                onClick={onClearFilter} 
                className="ml-1 p-0.5 text-text-muted hover:text-text-primary rounded hover:bg-border/60 transition-colors cursor-pointer"
                title="Show all messages"
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedAgent && onClearFilter && (
            <button 
              onClick={onClearFilter}
              className="text-xs text-accent-blue hover:underline cursor-pointer font-medium"
            >
              Show all ({totalMessagesCount || messages.length})
            </button>
          )}
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
            {messages.length} entries
          </span>
        </div>
      </div>

      <div ref={messagesRef} className="flex-1 min-h-0 overflow-y-auto p-5 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="max-w-lg py-8">
            <p className="text-sm font-medium mb-2">
              {selectedAgent ? `No messages found from ${filterLabel}.` : 'No agent messages yet.'}
            </p>
            <p className="text-sm leading-relaxed text-text-secondary">
              {selectedAgent 
                ? 'This investigator has not posted deductions in the current run yet.' 
                : (caseItem?.description || 'This investigation has not been briefed to the team.')}
            </p>
            {selectedAgent && (
              <button onClick={onClearFilter} className="mt-4 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border border-border rounded hover:bg-surface-hover transition-colors">
                View full swarm log
              </button>
            )}
            {!selectedAgent && (caseItem?.status === 'CREATED' || caseItem?.status === 'BLOCKED') && (
              <button onClick={onStart} className="mt-5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-text-primary text-primary rounded-sm hover:bg-text-secondary transition-colors">
                {caseItem?.status === 'BLOCKED' ? 'Run analysis again' : 'Start investigation'}
              </button>
            )}
          </div>
        ) : (
          messages.map((m, i) => <AgentMessage key={m.id || i} message={m} />)
        )}
      </div>
    </div>
  );
}
