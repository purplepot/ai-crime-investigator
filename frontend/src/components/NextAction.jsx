import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function NextAction({ action }) {
  if (!action) return null;
  return (
    <div className="bg-surface border border-text-muted rounded-md p-4 mb-4">
      <div className="flex items-center gap-2 text-text-primary font-semibold text-sm mb-3">
        <AlertTriangle size={16} className="text-accent-amber" /> WAITING FOR EVIDENCE
      </div>
      <div className="text-sm text-text-primary mb-2">
        <span className="font-bold">Next step:</span> {action.action_type || action.type || 'Review'} — {action.target || 'Case file'}
      </div>
      {action.reason && <p className="text-xs text-text-secondary mb-3 leading-relaxed">{action.reason}</p>}
      {action.question && <div className="bg-primary p-2.5 rounded-sm border border-border text-xs text-text-primary"><span className="font-semibold">Question:</span> {action.question}</div>}
    </div>
  );
}
