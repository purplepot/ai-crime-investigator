import React from 'react';
import { useCaseStore } from '../stores/caseStore';

const COLOR_MAP = {
  blue: { dpBg: 'bg-blue-600 text-white border-blue-700', badge: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50' },
  cyan: { dpBg: 'bg-cyan-600 text-white border-cyan-700', badge: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/50' },
  rose: { dpBg: 'bg-rose-600 text-white border-rose-700', badge: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50' },
  amber: { dpBg: 'bg-amber-600 text-white border-amber-700', badge: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50' },
  emerald: { dpBg: 'bg-emerald-600 text-white border-emerald-700', badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50' },
  purple: { dpBg: 'bg-purple-600 text-white border-purple-700', badge: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/50' },
  indigo: { dpBg: 'bg-indigo-600 text-white border-indigo-700', badge: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/50' },
  teal: { dpBg: 'bg-teal-600 text-white border-teal-700', badge: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/50' },
  red: { dpBg: 'bg-red-600 text-white border-red-700', badge: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50' },
  slate: { dpBg: 'bg-slate-600 text-white border-slate-700', badge: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/50' },
};

export default function AgentMessage({ message }) {
  const roster = useCaseStore(state => state.roster);
  const agentKey = String(message.agent_id || message.agent_name || '').toLowerCase().replace(/\s+/g, '_');
  
  const rosterEntry = (roster || []).find(r => r.agent_key === agentKey);
  const colors = rosterEntry ? (COLOR_MAP[rosterEntry.color] || COLOR_MAP.slate) : COLOR_MAP.slate;
  
  const config = rosterEntry ? {
    name: rosterEntry.display_name,
    initials: rosterEntry.initials,
    dpBg: colors.dpBg,
    badge: colors.badge,
  } : {
    name: message.agent_name || message.agent_id || 'Investigation Agent',
    initials: 'AI',
    dpBg: 'bg-zinc-700 text-white border-zinc-800',
    badge: 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
  };

  const agentName = message.agent_name || config.name;
  const timestamp = message.created_at || message.createdAt || message.timestamp;
  const label = message.message_type ? message.message_type.toLowerCase().replace(/_/g, ' ') : 'update';
  
  return (
    <div className="mb-4 flex gap-3 items-start">
      {/* Colored Agent Avatar (DP) */}
      <div className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center text-[10px] font-bold tracking-wider shadow-sm select-none ${config.dpBg}`}>
        {config.initials}
      </div>

      {/* Message Content Container */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 mb-1.5 px-0.5">
          <span className="text-xs font-semibold text-text-primary">{agentName}</span>
          <span className={`text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border ${config.badge}`}>
            {label}
          </span>
          {timestamp && (
            <span className="ml-auto text-[10px] text-text-muted">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Uniform White Background Card for All Agents */}
        <div className="rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap bg-surface border border-border text-text-primary shadow-minimal">
          {message.content || 'No details were recorded for this update.'}
        </div>
      </div>
    </div>
  );
}
