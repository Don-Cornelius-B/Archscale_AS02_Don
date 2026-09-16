import React, { useState } from 'react';
import { Play, Zap } from 'lucide-react';

export default function IngestionPanel({ presets, onProcess, isProcessing }) {
  const [channel, setChannel] = useState('Email');
  const [sender, setSender] = useState('');
  const [rawText, setRawText] = useState('');

  const handlePresetClick = (preset) => {
    setChannel(preset.channel);
    setSender(preset.sender);
    setRawText(preset.raw_text);
    onProcess({ channel: preset.channel, sender: preset.sender, raw_text: preset.raw_text });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    onProcess({ channel, sender, raw_text: rawText });
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-emerald-400" />
          Quick-Load Presets
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              disabled={isProcessing}
              className="text-left p-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80 hover:border-emerald-500/50 transition-all disabled:opacity-50 group"
            >
              <div className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">{preset.label}</div>
              <div className="text-xs text-zinc-500 mt-1 truncate">{preset.raw_text}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-medium text-zinc-100 mb-4">Manual Input</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Site Note">Site Note</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Sender</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. Site Supervisor"
                className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Raw Message</label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste unstructured communication here..."
              rows={5}
              className="w-full p-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing || !rawText.trim()}
            className="btn-primary w-full gap-2 mt-2"
          >
            {isProcessing ? (
              <span className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Reconciliation
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
