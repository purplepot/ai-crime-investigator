import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function CaseHeader({ caseItem }) {
  if (!caseItem) return null;
  return (
    <div className="bg-surface border-b border-border p-4 flex items-center justify-between shrink-0">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="text-text-secondary hover:text-text-primary text-sm">← Back</Link>
          <StatusBadge status={caseItem.status} />
        </div>
        <h1 className="text-xl font-bold text-text-primary">{caseItem.title}</h1>
      </div>
    </div>
  );
}
