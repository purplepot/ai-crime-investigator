import React from 'react';

export default function StatusBadge({ status }) {
  let color = 'bg-border text-text-secondary';
  let label = status;

  switch (status) {
    case 'CREATED':
      color = 'bg-border text-text-secondary';
      label = 'CREATED';
      break;
    case 'ACTIVE':
      color = 'bg-text-primary text-primary';
      label = 'ACTIVE';
      break;
    case 'BLOCKED':
      color = 'border border-accent-amber text-accent-amber bg-amber-500/10';
      label = 'WAITING';
      break;
    case 'RESOLVED':
      color = 'border border-accent-green text-accent-green bg-green-500/10';
      label = 'RESOLVED';
      break;
  }

  return (
    <span className={`text-[10px] px-2 py-1 rounded-sm font-semibold uppercase tracking-wider ${color}`}>
      {label}
    </span>
  );
}
