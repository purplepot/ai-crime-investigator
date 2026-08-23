import React, { useEffect, useRef } from 'react';
import AgentMessage from './AgentMessage';

export default function AgentChat({ messages, caseItem, onStart }) {
  const messagesRef = useRef(null);

  useEffect(() => {
    const panel = messagesRef.current;
    if (panel) panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted mb-1">Case communication</p>
          <h3 className="text-sm font-semibold">Swarm chat</h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-text-muted">{messages.length} entries</span>
      </div>
      <div ref={messagesRef} className="flex-1 min-h-0 overflow-y-auto p-5 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="max-w-lg py-8">
            <p className="text-sm font-medium mb-2">No agent messages yet.</p>
            <p className="text-sm leading-relaxed text-text-secondary">{caseItem?.description || 'This investigation has not been briefed to the team.'}</p>
            {(caseItem?.status === 'CREATED' || caseItem?.status === 'BLOCKED') && (
              <button onClick={onStart} className="mt-5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-text-primary text-primary rounded-sm hover:bg-text-secondary transition-colors">
                {caseItem?.status === 'BLOCKED' ? 'Run analysis again' : 'Start investigation'}
              </button>
            )}
          </div>
        ) : (
          messages.map((m, i) => <AgentMessage key={i} message={m} />)
        )}
      </div>
    </div>
  );
}
