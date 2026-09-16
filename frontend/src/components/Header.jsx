import React from 'react';
import { Layers, FileSignature, AlertTriangle, AlertCircle, ShieldCheck, ListTodo, Lock } from 'lucide-react';

export default function Header({ baseline, payload }) {
  const isConflict = payload?.conflict?.is_conflict;
  const isCritical = payload?.conflict?.severity === 'critical';
  const taskCount = payload?.actions?.length || 0;
  
  const decisionsCount = payload?.decisions?.length || 0;

  const activeDrawingRevision = baseline?.active_drawing_revision || "REV 05";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
      <div className="container mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-100">ArchScale Comm-Engine</h1>
            <p className="text-xs text-zinc-400 font-medium">{baseline?.project_name || "Skyline Residences - Phase 2"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Baseline Revision Lock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-sm font-medium">
            <FileSignature className="w-4 h-4" />
            <span>Baseline: {activeDrawingRevision}</span>
          </div>

          {/* Clashes Detected */}
          {isConflict ? (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
              isCritical 
                ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {isCritical ? <AlertTriangle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{isCritical ? '1 Critical Clash' : '1 Spec Warning'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>0 Clashes</span>
            </div>
          )}

          {/* Pending Tasks */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-sm font-medium">
            <ListTodo className="w-4 h-4 text-sky-400" />
            <span>{taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}</span>
          </div>

          {/* Decisions Locked */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-sm font-medium">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>{decisionsCount} {decisionsCount === 1 ? 'Decision' : 'Decisions'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
