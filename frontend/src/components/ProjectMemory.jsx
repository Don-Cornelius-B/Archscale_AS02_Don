import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Mail, 
  MessageSquare, 
  StickyNote, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  Tag
} from 'lucide-react';

const channelConfig = {
  WhatsApp: {
    icon: MessageSquare,
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    label: 'WhatsApp'
  },
  Email: {
    icon: Mail,
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
    label: 'Email'
  },
  'Site Note': {
    icon: StickyNote,
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    label: 'Site Note'
  }
};

export default function ProjectMemory({ history = [], onSelectHistoryItem }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Instant zero-lag multi-field filter
  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return history;

    return history.filter((item) => {
      // 1. Raw Text
      if (item.raw_text && item.raw_text.toLowerCase().includes(q)) return true;

      // 2. Extracted Summary
      if (item.summary && item.summary.toLowerCase().includes(q)) return true;

      // 3. Locked Decisions
      if (item.decisions && item.decisions.some(d => d.toLowerCase().includes(q))) return true;

      // 4. Actions: Task, Role, Zone
      if (item.actions && item.actions.some(a => 
        (a.task && a.task.toLowerCase().includes(q)) ||
        (a.assigned_role && a.assigned_role.toLowerCase().includes(q)) ||
        (a.zone_or_room && a.zone_or_room.toLowerCase().includes(q))
      )) return true;

      // 5. Conflict Reason
      if (item.conflict?.reason && item.conflict.reason.toLowerCase().includes(q)) return true;

      // 6. Sender or Channel
      if (item.sender && item.sender.toLowerCase().includes(q)) return true;
      if (item.channel && item.channel.toLowerCase().includes(q)) return true;

      return false;
    });
  }, [history, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search historical project memory (decisions, zones, materials, keywords)..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600 shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Header & Counter */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <span>
          Showing <span className="text-zinc-200 font-medium">{filteredHistory.length}</span> of {history.length} audit entries
        </span>
        {searchQuery && (
          <span className="italic text-zinc-400">
            Filtered by &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>

      {/* Feed List */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel p-10 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-zinc-300">No project memory matches found</h4>
            <p className="text-xs text-zinc-500 max-w-sm">
              No historical communications or decisions matched &ldquo;{searchQuery}&rdquo;. Try another material, room name, or revision tag.
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              Clear search filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => {
            const channel = channelConfig[item.channel] || channelConfig.Email;
            const ChannelIcon = channel.icon;
            const isConflict = item.conflict?.is_conflict;
            const isCritical = item.conflict?.severity === 'critical';

            return (
              <div 
                key={item.id} 
                className="glass-panel p-5 space-y-4 hover:border-zinc-700 transition-all border border-zinc-800/80"
              >
                {/* Top Bar: Channel Badge, Timestamp, Conflict Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${channel.badge}`}>
                      <ChannelIcon className="w-3.5 h-3.5" />
                      {item.channel}
                    </span>
                    {item.sender && (
                      <span className="text-xs text-zinc-400 font-medium">
                        {item.sender}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Conflict Status Pill */}
                    {isConflict ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border ${
                        isCritical 
                          ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        <AlertTriangle className="w-3 h-3" />
                        {isCritical ? 'REV 04 Clash Flagged' : 'Spec Warning'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        Clean Spec
                      </span>
                    )}

                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                {/* Raw Input Excerpt */}
                <div className="bg-zinc-950/60 rounded-md p-3 border border-zinc-900">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Raw Inbound Snippet
                  </div>
                  <p className="text-xs text-zinc-400 font-mono italic leading-relaxed">
                    &ldquo;{item.raw_text}&rdquo;
                  </p>
                </div>

                {/* Extracted 1-Sentence Summary */}
                <div>
                  <h5 className="text-[11px] uppercase font-bold tracking-wider text-zinc-400 mb-1">
                    Reconciliation Summary
                  </h5>
                  <p className="text-sm text-zinc-200 font-medium leading-relaxed">
                    {item.summary}
                  </p>
                  {isConflict && item.conflict?.reason && (
                    <p className={`text-xs mt-1 font-medium ${isCritical ? 'text-red-400/90' : 'text-amber-400/90'}`}>
                      ↳ Conflict Note: {item.conflict.reason}
                    </p>
                  )}
                </div>

                {/* Locked Decisions (if any) */}
                {item.decisions && item.decisions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] uppercase font-bold tracking-wider text-zinc-400">
                      Locked Directives
                    </div>
                    <div className="space-y-1">
                      {item.decisions.map((dec, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{dec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Action Item Badges */}
                {item.actions && item.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.actions.map((act, i) => (
                      <div key={i} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                        <span className="font-semibold text-zinc-400">{act.assigned_role}:</span>
                        <span className="truncate max-w-[200px]">{act.task}</span>
                        {act.zone_or_room && (
                          <span className="text-zinc-500 flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {act.zone_or_room}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Actions: Re-inspect Button */}
                <div className="pt-2 flex justify-end border-t border-zinc-800/60">
                  <button
                    onClick={() => onSelectHistoryItem && onSelectHistoryItem(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 transition-all hover:shadow-sm"
                  >
                    <span>Re-inspect in Active Triage</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
