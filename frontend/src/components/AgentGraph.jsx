import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { FileSearch, Users, Clock, Mic, Gavel, Cpu, X, CornerDownRight } from 'lucide-react';

const AGENT_META = {
  lead_detective: {
    id: 'Lead Detective',
    icon: Cpu,
    role: 'Coordinator',
    color: 'bg-blue-600 text-white',
    badge: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50'
  },
  evidence_analyst: {
    id: 'Evidence Analyst',
    icon: FileSearch,
    role: 'Physical evidence',
    color: 'bg-cyan-600 text-white',
    badge: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/50'
  },
  suspect_analyst: {
    id: 'Suspect Analyst',
    icon: Users,
    role: 'Motives & means',
    color: 'bg-rose-600 text-white',
    badge: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50'
  },
  timeline_agent: {
    id: 'Timeline Agent',
    icon: Clock,
    role: 'Event reconstruction',
    color: 'bg-amber-600 text-white',
    badge: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50'
  },
  interview_agent: {
    id: 'Interview Agent',
    icon: Mic,
    role: 'Statements',
    color: 'bg-emerald-600 text-white',
    badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50'
  },
  prosecutor: {
    id: 'Prosecutor',
    icon: Gavel,
    role: 'Final review',
    color: 'bg-purple-600 text-white',
    badge: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/50'
  }
};

const AGENTS = [
  { key: 'lead_detective', ...AGENT_META.lead_detective },
  { key: 'evidence_analyst', ...AGENT_META.evidence_analyst },
  { key: 'suspect_analyst', ...AGENT_META.suspect_analyst },
  { key: 'timeline_agent', ...AGENT_META.timeline_agent },
  { key: 'interview_agent', ...AGENT_META.interview_agent },
  { key: 'prosecutor', ...AGENT_META.prosecutor }
];

export default function AgentGraph({ selectedAgent, onSelectAgent, activeAgents = [], messages = [] }) {
  const [openAgent, setOpenAgent] = useState(null);
  const [paths, setPaths] = useState([]);

  const containerRef = useRef(null);
  const nodeRefs = useRef({});

  const agentKey = (value) => String(value || '').toLowerCase().replace(/\s+/g, '_');

  const latest = messages.reduce((items, message) => {
    const key = agentKey(message.agent_id || message.agent_name);
    return { ...items, [key]: message };
  }, {});

  const openMessages = messages.filter(message => agentKey(message.agent_id || message.agent_name) === openAgent);
  const openAgentData = AGENTS.find(agent => agent.key === openAgent);

  const handleSelect = (key) => {
    onSelectAgent(key === selectedAgent ? null : key);
    setOpenAgent(key === openAgent ? null : key);
  };

  // Recalculate dynamic SVG curves connecting exact node anchor points
  const updatePaths = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const leadEl = nodeRefs.current['lead_detective'];
    const prosEl = nodeRefs.current['prosecutor'];

    if (!leadEl || !prosEl) return;

    const leadRect = leadEl.getBoundingClientRect();
    const prosRect = prosEl.getBoundingClientRect();

    const leadRight = {
      x: leadRect.right - containerRect.left,
      y: leadRect.top + leadRect.height / 2 - containerRect.top
    };

    const prosLeft = {
      x: prosRect.left - containerRect.left,
      y: prosRect.top + prosRect.height / 2 - containerRect.top
    };

    const middleKeys = ['evidence_analyst', 'suspect_analyst', 'timeline_agent', 'interview_agent'];
    const newPaths = [];

    middleKeys.forEach(key => {
      const midEl = nodeRefs.current[key];
      if (!midEl) return;

      const midRect = midEl.getBoundingClientRect();
      const midLeft = {
        x: midRect.left - containerRect.left,
        y: midRect.top + midRect.height / 2 - containerRect.top
      };
      const midRight = {
        x: midRect.right - containerRect.left,
        y: midRect.top + midRect.height / 2 - containerRect.top
      };

      // Left Curve: Lead Detective -> Specialist
      const dx1 = midLeft.x - leadRight.x;
      const path1 = `M ${leadRight.x} ${leadRight.y} C ${leadRight.x + dx1 * 0.5} ${leadRight.y}, ${leadRight.x + dx1 * 0.5} ${midLeft.y}, ${midLeft.x - 4} ${midLeft.y}`;

      // Right Curve: Specialist -> Prosecutor
      const dx2 = prosLeft.x - midRight.x;
      const path2 = `M ${midRight.x} ${midRight.y} C ${midRight.x + dx2 * 0.5} ${midRight.y}, ${midRight.x + dx2 * 0.5} ${prosLeft.y}, ${prosLeft.x - 4} ${prosLeft.y}`;

      newPaths.push(path1, path2);
    });

    setPaths(newPaths);
  };

  useLayoutEffect(() => {
    updatePaths();
  }, [messages, selectedAgent]);

  useEffect(() => {
    const handleResize = () => updatePaths();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(updatePaths, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-surface border border-border rounded-md overflow-hidden relative">
      {/* Pinned Network Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-border shrink-0 bg-surface">
        <div>
          <p className="text-[10px] tracking-[0.18em] uppercase text-text-muted mb-1">Live routing</p>
          <h3 className="font-semibold tracking-tight text-sm">Swarm Architecture Network</h3>
        </div>
        {selectedAgent && (
          <button 
            onClick={() => { onSelectAgent(null); setOpenAgent(null); }} 
            className="text-xs text-text-secondary hover:text-text-primary border border-border px-3 py-1.5 rounded-sm hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Graph Interactive Canvas */}
      <div className="flex-1 min-h-0 overflow-auto custom-scrollbar p-6 relative">
        <div ref={containerRef} className="relative min-w-[760px] h-full flex items-center justify-between gap-10 py-4">
          
          {/* Dynamically Aligned SVG Arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="network-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,1 L7,4 L0,7 Z" fill="var(--color-text-muted)" />
              </marker>
            </defs>
            {paths.map((d, i) => (
              <path 
                key={i} 
                d={d} 
                fill="none" 
                stroke="var(--color-border)" 
                strokeWidth="1.5" 
                markerEnd="url(#network-arrow)" 
              />
            ))}
          </svg>

          {/* COLUMN 1: Lead Detective */}
          <div className="w-[28%] z-10">
            <AgentNode 
              ref={el => nodeRefs.current['lead_detective'] = el}
              agent={AGENTS[0]} 
              selected={agentKey(selectedAgent) === AGENTS[0].key} 
              active={activeAgents.some(active => agentKey(active) === AGENTS[0].key)} 
              message={latest[AGENTS[0].key]} 
              onClick={() => handleSelect(AGENTS[0].key)} 
            />
          </div>

          {/* COLUMN 2: 4 Specialist Agents */}
          <div className="w-[38%] z-10 flex flex-col gap-3 py-2">
            {AGENTS.slice(1, 5).map(agent => (
              <AgentNode 
                key={agent.key}
                ref={el => nodeRefs.current[agent.key] = el}
                agent={agent} 
                selected={agentKey(selectedAgent) === agent.key} 
                active={activeAgents.some(active => agentKey(active) === agent.key)} 
                message={latest[agent.key]} 
                onClick={() => handleSelect(agent.key)} 
              />
            ))}
          </div>

          {/* COLUMN 3: Prosecutor */}
          <div className="w-[28%] z-10">
            <AgentNode 
              ref={el => nodeRefs.current['prosecutor'] = el}
              agent={AGENTS[5]} 
              selected={agentKey(selectedAgent) === AGENTS[5].key} 
              active={activeAgents.some(active => agentKey(active) === AGENTS[5].key)} 
              message={latest[AGENTS[5].key]} 
              onClick={() => handleSelect(AGENTS[5].key)} 
            />
          </div>
        </div>
      </div>

      {/* Agent Details / Chat Log Popover: Pinned Bottom-Right of Left Section */}
      {openAgentData && (
        <div className="absolute right-5 bottom-5 z-30 w-96 max-h-[380px] flex flex-col bg-surface border border-border rounded-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-hover shrink-0">
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm ${openAgentData.color}`}>
                {openAgentData.initials || 'AI'}
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-text-muted">Agent Log Stream</p>
                <p className="text-xs font-bold text-text-primary">{openAgentData.id}</p>
              </div>
            </div>
            <button 
              onClick={() => setOpenAgent(null)} 
              className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-surface transition-colors cursor-pointer"
              title="Close log"
            >
              <X size={15} />
            </button>
          </div>
          
          <div className="overflow-y-auto custom-scrollbar p-4 space-y-3.5 flex-1 min-h-0 bg-surface">
            {openMessages.length ? openMessages.map((message, index) => (
              <div key={message.id || index} className="border-l-2 border-border pl-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase tracking-wider text-text-muted font-mono">
                    {message.message_type || 'Update'}
                  </span>
                  {message.created_at && (
                    <span className="text-[9px] text-text-muted">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-text-primary">
                  {message.content}
                </p>
              </div>
            )) : (
              <div className="py-6 text-center">
                <p className="text-xs text-text-muted italic">No messages from this agent yet.</p>
              </div>
            )}
          </div>
          
          <div className="px-4 py-2 border-t border-border bg-surface-hover flex items-center justify-between text-[10px] text-text-muted shrink-0">
            <span>{openMessages.length} entries recorded</span>
            <span className="flex items-center gap-1"><CornerDownRight size={10} /> Active in swarm</span>
          </div>
        </div>
      )}
    </div>
  );
}

const AgentNode = React.forwardRef(({ agent, selected, active, message, onClick }, ref) => {
  const Icon = agent.icon;
  return (
    <div ref={ref} className="w-full">
      <button 
        type="button"
        onClick={onClick} 
        className={`w-full text-left border rounded-md p-3.5 transition-all shadow-minimal bg-surface cursor-pointer ${
          selected 
            ? 'ring-2 ring-text-primary border-text-primary' 
            : 'border-border hover:border-text-secondary hover:bg-surface-hover'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center shadow-sm ${agent.color}`}>
            <Icon size={14} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold text-text-primary truncate">{agent.id}</span>
            <span className="block text-[10px] text-text-muted truncate">{agent.role}</span>
          </span>
          {active && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-accent-green animate-pulse" title="Active in swarm" />
          )}
        </div>
        <p className="mt-2 pt-2 border-t border-border text-[11px] leading-snug text-text-secondary line-clamp-2">
          {message?.content || 'Waiting for dispatch...'}
        </p>
      </button>
    </div>
  );
});
