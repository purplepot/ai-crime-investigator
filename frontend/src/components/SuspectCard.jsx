import React from 'react';
import { User } from 'lucide-react';

export default function SuspectCard({ suspect }) {
  const score = Number(suspect.suspicionScore ?? suspect.overall_suspicion ?? 0);
  
  const renderBar = (label, value) => (
    <div className="flex items-center justify-between gap-2 mb-1">
      <span className="text-[10px] text-text-secondary uppercase w-16">{label}</span>
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-accent-amber" style={{ width: `${value * 100}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-text-secondary">
          <User size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm">{suspect.name}</h4>
          <div className="text-xs text-text-muted">Suspicion: {Math.round(score * 100)}%</div>
        </div>
      </div>
      
      <div className="mb-3">
        {renderBar('Motive', Number(suspect.motive ?? suspect.motive_score ?? 0))}
        {renderBar('Means', Number(suspect.means ?? suspect.means_score ?? 0))}
        {renderBar('Opportunity', Number(suspect.opportunity ?? suspect.opportunity_score ?? 0))}
      </div>

      <div className="text-xs flex items-center gap-2">
        <span className="text-text-muted uppercase">Alibi:</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
          (suspect.alibiStatus || suspect.alibi_status) === 'VERIFIED' ? 'bg-accent-green/20 text-accent-green' :
          (suspect.alibiStatus || suspect.alibi_status) === 'BROKEN' ? 'bg-accent-red/20 text-accent-red' :
          'bg-border text-text-secondary'
        }`}>{suspect.alibiStatus || suspect.alibi_status || 'UNKNOWN'}</span>
      </div>
    </div>
  );
}
