import React from 'react';
import { FileText, MapPin } from 'lucide-react';

export default function EvidenceCard({ evidence }) {
  const rel = evidence.reliability || 0;
  let color = 'bg-accent-green';
  if (rel < 0.3) color = 'bg-accent-red';
  else if (rel < 0.7) color = 'bg-accent-amber';

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {String(evidence.type).toLowerCase() === 'location' ? <MapPin size={16} className="text-text-secondary" /> : <FileText size={16} className="text-text-secondary" />}
          <h4 className="font-bold text-sm">{evidence.name}</h4>
        </div>
      </div>
      <p className="text-xs text-text-secondary mb-3">{evidence.description}</p>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-text-muted uppercase">Reliability</span>
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${rel * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}
