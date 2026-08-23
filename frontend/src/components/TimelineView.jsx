import React from 'react';
import { Clock } from 'lucide-react';

export default function TimelineView({ timeline }) {
  return (
    <div className="bg-surface border border-border rounded-md p-5 h-full flex flex-col overflow-hidden">
      <div className="mb-4 shrink-0">
        <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted mb-1">Sequence of events</p>
        <h3 className="font-semibold text-sm">Chronological Timeline</h3>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
        <div className="relative border-l-2 border-border ml-3 mt-2">
          {timeline.map((event, i) => (
            <div key={i} className="mb-6 ml-6 relative">
              <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-surface ${event.verified ? 'border-accent-green' : 'border-accent-amber'}`}></div>
              <div className="text-xs text-text-muted mb-1 flex items-center gap-1"><Clock size={12}/> {event.eventTime || event.event_time || event.timestamp || 'Time unknown'}</div>
              <div className="text-sm text-text-primary mb-1">{event.description}</div>
              <div className="text-[10px] text-text-secondary uppercase">Source: {event.origin || event.source || 'Unknown'}</div>
            </div>
          ))}
          {timeline.length === 0 && (
            <div className="text-sm text-text-muted italic ml-4">Timeline is currently empty.</div>
          )}
        </div>
      </div>
    </div>
  );
}
