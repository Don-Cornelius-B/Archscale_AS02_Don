import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IngestionPanel from './components/IngestionPanel';
import ConflictBanner from './components/ConflictBanner';
import RoleFilterBar from './components/RoleFilterBar';
import ActionList from './components/ActionList';
import { getBaseline, getPresets, processMessage } from './services/api';

export default function App() {
  const [baseline, setBaseline] = useState(null);
  const [presets, setPresets] = useState([]);
  const [payload, setPayload] = useState(null);
  const [selectedRole, setSelectedRole] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [baselineData, presetsData] = await Promise.all([
          getBaseline(),
          getPresets()
        ]);
        setBaseline(baselineData);
        setPresets(presetsData);
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
    } catch (err) {
      console.error("Failed to process message", err);
      setError("Processing failed. Please check backend connection.");
    } finally {
      setIsProcessing(false);
    }
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

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
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
        </div>
      </main>
    </div>
  );
}
