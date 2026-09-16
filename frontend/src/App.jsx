import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IngestionPanel from './components/IngestionPanel';
import ConflictBanner from './components/ConflictBanner';
import RoleFilterBar from './components/RoleFilterBar';
import ActionList from './components/ActionList';
import ProjectMemory from './components/ProjectMemory';
import { getBaseline, getPresets, processMessage, fetchProjectHistory } from './services/api';

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
          setPayload({
            summary: historyData[0].summary,
            decisions: historyData[0].decisions || [],
            actions: historyData[0].actions || [],
            conflict: historyData[0].conflict
          });
        } else {
          // Initialize payload with the first item in default history so triage isn't empty
          setPayload({
            summary: DEFAULT_HISTORY[0].summary,
            decisions: DEFAULT_HISTORY[0].decisions || [],
            actions: DEFAULT_HISTORY[0].actions || [],
            conflict: DEFAULT_HISTORY[0].conflict
          });
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
        setError("Failed to connect to backend engine. Ensure the server is running.");
        // Still init payload to fallback default history
        setPayload({
          summary: DEFAULT_HISTORY[0].summary,
          decisions: DEFAULT_HISTORY[0].decisions || [],
          actions: DEFAULT_HISTORY[0].actions || [],
          conflict: DEFAULT_HISTORY[0].conflict
        });
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header baseline={baseline} payload={payload} />
      
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Column 1: Ingestion Feed (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-6">
            <IngestionPanel 
              presets={presets} 
              onProcess={handleProcess} 
              isProcessing={isProcessing} 
            />
          </div>

          {/* Column 2: Active Triage & Clash Hub (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <ConflictBanner conflict={payload?.conflict} />
            
            <div className="glass-panel p-6 shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Active Triage & Clash Hub</h2>
                <p className="text-sm text-zinc-400 mt-1">Real-time directive extraction & role assignments</p>
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

          {/* Column 3: Live Project Memory Ledger (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-6 shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Live Project Memory</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Searchable historical ledger of communications & locked directives
                </p>
              </div>

              <ProjectMemory 
                history={history} 
                onSelectHistoryItem={handleSelectHistoryItem} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
