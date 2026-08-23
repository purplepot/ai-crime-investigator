import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function CaseCard({ caseItem }) {
  const borderColor = 
    caseItem.status === 'BLOCKED' ? 'border-l-accent-amber' :
    caseItem.status === 'ACTIVE' ? 'border-l-accent-blue' :
    caseItem.status === 'RESOLVED' ? 'border-l-accent-green' : 'border-l-border';

  return (
    <Link to={`/case/${caseItem.id}`} className={`block bg-surface border border-border border-l-4 rounded-lg p-5 hover:bg-surface-hover transition-colors ${borderColor}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-text-primary">{caseItem.title}</h3>
        <StatusBadge status={caseItem.status} />
      </div>
      <p className="text-sm text-text-secondary line-clamp-2 mb-4">{caseItem.description}</p>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>Confidence: {caseItem.confidence || 0}%</span>
        <span>{new Date(caseItem.createdAt || Date.now()).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
