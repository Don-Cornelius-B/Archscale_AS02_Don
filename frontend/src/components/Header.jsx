import React from 'react';
import { Layers, FileSignature, Ruler } from 'lucide-react';

export default function Header({ baseline }) {
  if (!baseline) return <div className="h-16 border-b border-zinc-800 bg-zinc-900/50" />;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-100">ArchScale Comm-Engine</h1>
            <p className="text-xs text-zinc-400 font-medium">{baseline.project_name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <FileSignature className="w-4 h-4" />
            <span>{baseline.active_drawing_revision}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <Ruler className="w-4 h-4" />
            <span>{baseline.active_material_spec}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
