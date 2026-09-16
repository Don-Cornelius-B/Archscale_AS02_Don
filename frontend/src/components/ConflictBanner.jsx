import React from 'react';
import { AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ConflictBanner({ conflict }) {
  // If no conflict object provided, don't render anything or render idle state
  // But since we want to show "No Baseline Conflicts Detected" when clear, 
  // we check if conflict is explicitly not a conflict.
  if (!conflict) return null;

  const isConflict = conflict.is_conflict;
  const isCritical = conflict.severity === 'critical';

  if (!isConflict) {
    return (
      <div className="rounded-xl border p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 border-emerald-500/30 bg-emerald-950/20 text-emerald-300">
        <ShieldCheck className="w-5 h-5 mt-0.5 text-emerald-400 shrink-0" />
        <div>
          <h3 className="font-semibold text-sm">No Baseline Conflicts Detected</h3>
          <p className="text-sm mt-1 opacity-90 text-emerald-400/90">
            Inbound communication aligns with locked drawing revision and specifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
      isCritical 
        ? 'border-red-500/80 bg-red-950/40 text-red-200' 
        : 'border-amber-500/80 bg-amber-950/40 text-amber-200'
    }`}>
      {isCritical ? (
        <AlertTriangle className="w-5 h-5 mt-0.5 text-red-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 mt-0.5 text-amber-400 shrink-0" />
      )}
      <div>
        <h3 className="font-semibold text-sm">
          {isCritical ? 'Critical Baseline Clash Detected' : 'Baseline Warning Detected'}
        </h3>
        <p className={`text-sm mt-1 opacity-90 ${isCritical ? 'text-red-300' : 'text-amber-300'}`}>
          {conflict.reason}
        </p>
      </div>
    </div>
  );
}
