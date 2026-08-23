import React from 'react';
import { User, Briefcase, HeartHandshake, ShieldAlert, FileText } from 'lucide-react';

export default function SuspectCard({ suspect }) {
  const score = Number(suspect.suspicionScore ?? suspect.overall_suspicion ?? 0);
  const motiveScore = Number(suspect.motive ?? suspect.motive_score ?? 0);
  const meansScore = Number(suspect.means ?? suspect.means_score ?? 0);
  const oppScore = Number(suspect.opportunity ?? suspect.opportunity_score ?? 0);
  const alibiStatus = suspect.alibiStatus || suspect.alibi_status || 'UNKNOWN';

  const renderBar = (label, value, detail) => (
    <div className="mb-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-mono text-text-muted">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden mb-1">
        <div 
          className={`h-full transition-all duration-500 rounded-full ${
            value >= 0.7 ? 'bg-accent-red' : value >= 0.4 ? 'bg-accent-amber' : 'bg-accent-blue'
          }`} 
          style={{ width: `${Math.max(value * 100, 4)}%` }}
        ></div>
      </div>
      {detail && (
        <p className="text-[11px] text-text-muted leading-tight line-clamp-2">{detail}</p>
      )}
    </div>
  );

  return (
    <div className="bg-surface border border-border rounded-md p-4 flex flex-col justify-between shadow-minimal hover:border-text-secondary/40 transition-colors">
      <div>
        {/* Header: Avatar, Name, Age, Occupation */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-hover border border-border flex items-center justify-center text-text-primary font-bold text-xs uppercase tracking-wider shrink-0 shadow-sm">
              {suspect.name ? suspect.name.split(' ').map(n => n[0]).join('').slice(0, 2) : <User size={18} />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-primary leading-tight">{suspect.name}</h4>
              <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                {suspect.occupation && (
                  <span className="flex items-center gap-1">
                    <Briefcase size={12} className="shrink-0 text-text-muted" />
                    <span>{suspect.occupation}</span>
                  </span>
                )}
                {suspect.age && (
                  <span>• Age {suspect.age}</span>
                )}
              </div>
            </div>
          </div>

          {/* Suspicion Score Badge */}
          <div className={`px-2 py-1 rounded border text-[11px] font-bold font-mono tracking-wider shrink-0 ${
            score >= 0.7 ? 'bg-accent-red/10 text-accent-red border-accent-red/30' :
            score >= 0.4 ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/30' :
            'bg-surface-hover text-text-muted border-border'
          }`}>
            {Math.round(score * 100)}% SUSPICION
          </div>
        </div>

        {/* Relationship Badge */}
        {suspect.relationship && suspect.relationship !== 'N/A' && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-text-secondary bg-surface-hover/70 border border-border/80 px-2.5 py-1.5 rounded">
            <HeartHandshake size={13} className="shrink-0 text-accent-blue" />
            <span className="font-medium text-text-primary">Relationship:</span>
            <span className="truncate">{suspect.relationship}</span>
          </div>
        )}

        {/* Person Description / Background Info ("Their Things") */}
        {suspect.description && (
          <div className="mb-4 text-xs text-text-secondary bg-surface-hover/40 border border-border/60 p-2.5 rounded leading-relaxed">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1">
              <FileText size={11} /> Background & Case Connection
            </div>
            <p className="text-text-primary leading-relaxed">{suspect.description}</p>
          </div>
        )}

        {/* MOMA Quantitative Breakdown */}
        <div className="border-t border-border pt-3 mb-3 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1">
            <ShieldAlert size={11} /> MOMA Framework Assessment
          </div>
          {renderBar('Motive', motiveScore, suspect.motive_detail)}
          {renderBar('Means', meansScore, suspect.means_detail)}
          {renderBar('Opportunity', oppScore, suspect.opportunity_detail)}
        </div>
      </div>

      {/* Footer: Alibi & Profile Summary */}
      <div className="border-t border-border pt-3 mt-1 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Alibi Verification:</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${
            alibiStatus === 'VERIFIED' ? 'bg-accent-green/10 text-accent-green border-accent-green/30' :
            alibiStatus === 'BROKEN' ? 'bg-accent-red/10 text-accent-red border-accent-red/30' :
            alibiStatus === 'UNVERIFIED' ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/30' :
            'bg-surface-hover text-text-muted border-border'
          }`}>
            {alibiStatus}
          </span>
        </div>
        {suspect.alibi_detail && (
          <p className="text-[11px] text-text-muted leading-tight">{suspect.alibi_detail}</p>
        )}
        {suspect.profile_summary && (
          <div className="mt-1 p-2 rounded bg-surface-hover border border-border text-[11px] text-text-secondary leading-snug">
            <span className="font-semibold text-text-primary">Profiler Note: </span>
            {suspect.profile_summary}
          </div>
        )}
      </div>
    </div>
  );
}
