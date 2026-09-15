import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IngestionPanel from './components/IngestionPanel';
import ConflictBanner from './components/ConflictBanner';
import RoleFilterBar from './components/RoleFilterBar';
import ActionList from './components/ActionList';
import ProjectMemory from './components/ProjectMemory';
import { getBaseline, getPresets, processMessage, fetchProjectHistory } from './services/api';
import { Layers, History } from 'lucide-react';

const DEFAULT_HISTORY = [
  {
    id: "hist-001",
    timestamp: "Today, 09:15 AM",
    channel: "Email",
    sender: "Site Supervisor",
    raw_text: "Please proceed with plumbing layout as per Rev 04 drawings.",
    summary: "Direction to proceed with outdated plumbing layout.",
    decisions: [],
    actions: [],
    conflict: {
      is_conflict: true,
      severity: "critical",
      reason: "Referencing REV 04 when active project drawing is locked to REV 05."
    }
  },
  {
    id: "hist-002",
    timestamp: "Yesterday, 04:30 PM",
    channel: "WhatsApp",
    sender: "Client",
    raw_text: "Use previous marble in the foyer.",
    summary: "Request to use 'previous marble' in the foyer.",
    decisions: [],
    actions: [
      {
        task: "Confirm if 'previous marble' refers to Italian Statuario Marble.",
        assigned_role: "Architect",
        zone_or_room: "Foyer",
        priority: "Normal"
      }
    ],
    conflict: {
      is_conflict: true,
      severity: "warning",
      reason: "Ambiguous spec: Must confirm if previous refers to Italian Statuario Marble."
    }
  },
  {
    id: "hist-003",
    timestamp: "14 Sep 2026, 02:10 PM",
    channel: "Site Note",
    sender: "Inspector",
    raw_text: "Waterproofing failed inspection at master bath. Contractor redo by Thursday.",
    summary: "Waterproofing failed inspection at master bath.",
    decisions: [],
    actions: [
      {
        task: "Redo waterproofing in master bath by Thursday.",
        assigned_role: "Contractor",
        zone_or_room: "Master Bath",
        priority: "Urgent"
      }
    ],
    conflict: {
      is_conflict: false,
      severity: "none",
      reason: null
    }
  },
  {
    id: "hist-004",
    timestamp: "12 Sep 2026, 11:00 AM",
    channel: "WhatsApp",
    sender: "Client",
    raw_text: "Approved master layout except bathroom fittings.",
    summary: "Approval given for master layout excluding bathroom fittings.",
    decisions: ["Approved master layout (except bathroom fittings)."],
    actions: [
      {
        task: "Review and resolve bathroom fittings for sign-off.",
        assigned_role: "Architect",
        zone_or_room: "Master Bath",
        priority: "Normal"
      }
    ],
    conflict: {
      is_conflict: false,
      severity: "none",
      reason: null
    }
  }
];

export default function App() {
  const [baseline, setBaseline] = useState(null);
  const [presets, setPresets] = useState([]);
  const [payload, setPayload] = useState(null);
  const [selectedRole, setSelectedRole] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('triage'); // 'triage' | 'memory'
  const [history, setHistory] = useState(DEFAULT_HISTORY);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [baselineData, presetsData, historyData] = await Promise.all([
          getBaseline(),
          getPresets(),
          fetchProjectHistory().catch((err) => {
            console.warn("Could not fetch remote history, keeping defaults", err);
            return null;
          })
        ]);
        setBaseline(baselineData);
        setPresets(presetsData);
        if (historyData && Array.isArray(historyData) && historyData.length > 0) {
          setHistory(historyData);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
        setError("Failed to connect to backend engine. Ensure the server is running.");
      }
    }
    loadInitialData();
  }, []);

  const handleProcess = async (data) => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await processMessage(data);
      setPayload(result);

      // Prepend to project memory ledger
      const newHistoryItem = {
        id: `hist-${Date.now()}`,
        timestamp: "Just now",
        channel: data.channel || "Email",
        sender: data.sender || "Manual Input",
        raw_text: data.raw_text,
        summary: result.summary,
        decisions: result.decisions || [],
        actions: result.actions || [],
        conflict: result.conflict
      };
      setHistory((prev) => [newHistoryItem, ...prev]);

      // Keep newly processed item in active triage view
      setActiveTab('triage');
    } catch (err) {
      console.error("Failed to process message", err);
      setError("Processing failed. Please check backend connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setPayload({
      summary: item.summary,
      decisions: item.decisions || [],
      actions: item.actions || [],
      conflict: item.conflict
    });
    setActiveTab('triage');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header baseline={baseline} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            <IngestionPanel 
              presets={presets} 
              onProcess={handleProcess} 
              isProcessing={isProcessing} 
            />
          </div>

          {/* Right Column: Output / Memory */}
          <div className="lg:col-span-7 space-y-4">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 p-1 bg-zinc-900/90 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setActiveTab('triage')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    activeTab === 'triage'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Active Triage View</span>
                </button>

                <button
                  onClick={() => setActiveTab('memory')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    activeTab === 'memory'
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <History className="w-4 h-4 text-emerald-400" />
                  <span>Searchable Project Memory</span>
                  <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {history.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Tab 1: Active Triage View */}
            {activeTab === 'triage' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {payload && <ConflictBanner conflict={payload.conflict} />}
                
                <div className="glass-panel p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-zinc-100">Reconciliation Results</h2>
                    <p className="text-sm text-zinc-400 mt-1">Structured payload extracted from unstructured input.</p>
                  </div>
                  
                  <RoleFilterBar 
                    selectedRole={selectedRole} 
                    onSelectRole={setSelectedRole} 
                  />
                  
                  <ActionList 
                    payload={payload} 
                    selectedRole={selectedRole} 
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Searchable Project Memory View */}
            {activeTab === 'memory' && (
              <div className="glass-panel p-6 animate-in fade-in duration-200">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-zinc-100">Searchable Project Memory & Audit Trail</h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Persistent ledger of historical communications, baseline clashes, and locked directives.
                  </p>
                </div>

                <ProjectMemory 
                  history={history} 
                  onSelectHistoryItem={handleSelectHistoryItem} 
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
