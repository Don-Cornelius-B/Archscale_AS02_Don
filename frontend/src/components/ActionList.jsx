import React from 'react';
import { CheckCircle2, MapPin, Flag } from 'lucide-react';

const roleColors = {
  Architect: 'bg-sky-500/20 text-sky-300 border-sky-400/40 font-semibold',
  Contractor: 'bg-amber-500/20 text-amber-300 border-amber-400/40 font-semibold',
  Supplier: 'bg-purple-500/20 text-purple-300 border-purple-400/40 font-semibold',
  Client: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 font-semibold',
};

const priorityColors = {
  Urgent: 'bg-red-500/20 text-red-400',
  Normal: 'bg-zinc-800 text-zinc-300',
  Low: 'bg-zinc-900 border border-zinc-800 text-zinc-500',
};

export default function ActionList({ payload, selectedRole }) {
  if (!payload) return (
    <div className="glass-panel p-12 text-center text-zinc-500 flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-full border border-dashed border-zinc-700 flex items-center justify-center">
        <Flag className="w-5 h-5 text-zinc-600" />
      </div>
      <p>Awaiting unstructured communication payload...</p>
    </div>
  );

  const filteredActions = selectedRole === 'All' 
    ? payload.actions 
    : payload.actions.filter(a => a.assigned_role === selectedRole);

  return (
    <div className="max-h-[calc(100vh-340px)] overflow-y-auto pr-2 space-y-6">
      <div className="glass-panel p-5 border-l-2 border-l-emerald-500">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Executive Summary</h3>
        <p className="text-zinc-200 leading-relaxed">{payload.summary}</p>
      </div>

      {payload.decisions && payload.decisions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-400">Locked Decisions / Directives</h3>
          <div className="grid gap-2">
            {payload.decisions.map((decision, i) => (
              <div key={i} className="glass-panel p-3 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-200">{decision}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-zinc-400">Assigned Action Items ({filteredActions?.length || 0})</h3>
        <div className="grid gap-3">
          {!filteredActions || filteredActions.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No actions found for this role.</p>
          ) : (
            filteredActions.map((action, i) => (
              <div key={i} className="glass-panel p-4 hover:border-zinc-700 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-sm text-zinc-200 font-medium leading-snug">{action.task}</p>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${priorityColors[action.priority] || priorityColors.Normal}`}>
                    {action.priority}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-1 rounded-md border ${roleColors[action.assigned_role] || 'bg-zinc-800 text-zinc-300'}`}>
                    {action.assigned_role}
                  </span>
                  
                  {action.zone_or_room && (
                    <span className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {action.zone_or_room}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
