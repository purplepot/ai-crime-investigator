import React from 'react';
import ConfidenceMeter from './ConfidenceMeter';

export default function InvestigationState({ caseItem }) {
  if (!caseItem) return null;
  
  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col h-full">
      <h3 className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-wide border-b border-border pb-2">Current State</h3>
      
      <div className="mb-4">
        <div className="text-xs text-text-muted uppercase mb-1">Stage</div>
        <div className="text-sm font-bold text-text-primary">
          {caseItem.current_stage === 'BLOCKED' ? 'WAITING FOR EVIDENCE' : (caseItem.current_stage || 'INITIALIZING')}
        </div>
        <ConfidenceMeter value={caseItem.confidence || 0} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="mb-4">
          <h4 className="text-xs text-text-secondary uppercase mb-2 font-bold">Known Facts</h4>
          <ul className="list-disc list-inside text-sm text-text-primary space-y-1">
            {(caseItem.known_facts || []).map((f, i) => <li key={i} className="text-xs">{f}</li>)}
            {!(caseItem.known_facts?.length) && <li className="text-xs text-text-muted italic list-none">None yet</li>}
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="text-xs text-text-secondary uppercase mb-2 font-bold">Unknowns</h4>
          <ul className="list-disc list-inside text-sm text-text-primary space-y-1">
            {(caseItem.unknowns || []).map((f, i) => <li key={i} className="text-xs">{f}</li>)}
            {!(caseItem.unknowns?.length) && <li className="text-xs text-text-muted italic list-none">None yet</li>}
          </ul>
        </div>

        {caseItem.contradictions?.length > 0 && (
          <div>
            <h4 className="text-xs text-accent-red uppercase mb-2 font-bold">Contradictions</h4>
            <ul className="list-disc list-inside text-sm text-accent-red space-y-1">
              {caseItem.contradictions.map((f, i) => <li key={i} className="text-xs">{f}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
