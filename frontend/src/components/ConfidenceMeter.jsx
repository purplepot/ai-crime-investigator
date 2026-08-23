import React from 'react';

export default function ConfidenceMeter({ value }) {
  const percentage = Math.round((Number(value) <= 1 ? Number(value) * 100 : Number(value)) || 0);
  return (
    <div className="flex flex-col gap-1 w-full mt-4">
      <div className="flex justify-between text-xs text-text-secondary uppercase font-bold">
        <span>Confidence</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-primary rounded-full overflow-hidden border border-border">
        <div 
          className="h-full bg-text-primary transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
