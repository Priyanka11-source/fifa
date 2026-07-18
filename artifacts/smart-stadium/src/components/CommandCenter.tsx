import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetOperationsState,
  useGenerateOperationsBrief,
  getGetOperationsStateQueryKey,
  useSimulateIncident,
  useResetIncident,
} from '@workspace/api-client-react';
import type { Directive } from '@workspace/api-client-react';
import { ShieldAlert, RefreshCw, AlertTriangle, CloudRain, ShieldCheck, Zap, Users, Train, Sliders, Check } from 'lucide-react';

const SEVERITY_STYLE: Record<string, string> = {
  critical: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 warn-neon-glow',
  watch: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

const INCIDENT_ICONS = {
  storm: CloudRain,
  transit_disruption: Train,
  crowd_surge: Users,
  grid_failure: Zap,
};

const INCIDENT_LABELS = {
  storm: 'Severe Thunderstorm',
  transit_disruption: 'Transit System Outage',
  crowd_surge: 'Concourse Crowd Surge',
  grid_failure: 'Power Substation Failure',
};

export default function CommandCenter() {
  const queryClient = useQueryClient();
  const { data: state, refetch: refetchState } = useGetOperationsState({
    query: { queryKey: getGetOperationsStateQueryKey(), refetchInterval: 4000 },
  });
  const { mutate: generateBrief, data: brief, isPending: isBriefPending } = useGenerateOperationsBrief();
  
  const { mutate: simulateIncident, isPending: isSimulating } = useSimulateIncident();
  const { mutate: resetIncident, isPending: isResetting } = useResetIncident();
  
  const [directives, setDirectives] = useState<Directive[]>([]);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Custom manual telemetry states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [customWeather, setCustomWeather] = useState('Clear');
  const [customEnergy, setCustomEnergy] = useState(60);
  const [customGates, setCustomGates] = useState<Record<string, number>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync inputs with live telemetry only when editor is closed
  useEffect(() => {
    if (state && !isEditorOpen) {
      setCustomWeather(state.weatherCondition);
      setCustomEnergy(state.energyLoadPct);
      const gateMap: Record<string, number> = {};
      state.gates.forEach((g) => {
        gateMap[g.id] = g.crowdPct;
      });
      setCustomGates(gateMap);
    }
  }, [state, isEditorOpen]);

  useEffect(() => {
    generateBrief();
    const interval = setInterval(() => generateBrief(), 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (brief?.directives) {
      setDirectives(brief.directives);
    }
  }, [brief]);

  async function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const baseUrl = import.meta.env.DEV ? "http://localhost:5000" : "";
      const response = await fetch(`${baseUrl}/api/genai/operations/custom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weatherCondition: customWeather,
          energyLoadPct: Number(customEnergy),
          activeIncident: "manual",
          gates: Object.entries(customGates).map(([id, crowdPct]) => ({ id, crowdPct: Number(crowdPct) }))
        })
      });
      if (response.ok) {
        queryClient.invalidateQueries();
        refetchState();
        generateBrief();
        setIsEditorOpen(false);
      }
    } catch (err) {
      console.error("Failed to update custom telemetry", err);
    } finally {
      setIsUpdating(false);
    }
  }

  function handleSimulate(type: 'storm' | 'transit_disruption' | 'crowd_surge' | 'grid_failure') {
    setActiveAlert(type);
    simulateIncident(
      { data: { type } },
      {
        onSuccess: () => {
          // Invalidate and refetch immediately
          queryClient.invalidateQueries();
          refetchState();
          generateBrief();
        },
      }
    );
  }

  function handleReset() {
    setActiveAlert(null);
    resetIncident(
      undefined,
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
          refetchState();
          generateBrief();
        },
      }
    );
  }

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Simulation Command Banner */}
      <div className="glass-panel p-6 rounded-sm border-l-2 border-l-primary/40 relative overflow-hidden flex flex-col xl:flex-row gap-8 justify-between items-start xl:items-center">
        <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col gap-1 z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] font-medium">Incident Command System</span>
          </div>
          <h4 className="text-xl font-serif text-foreground">Real-Time GenAI Decision Support Tool</h4>
          <p className="text-xs text-foreground/75 font-light leading-relaxed">
            Simulate emergency matchday incidents. The platform will dynamically calculate response directives, dispatch virtual safety stewards, and reroute fan flows on the maps and signages.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-3 z-10 shrink-0">
          {(['storm', 'transit_disruption', 'crowd_surge', 'grid_failure'] as const).map((inc) => {
            const Icon = INCIDENT_ICONS[inc];
            const label = INCIDENT_LABELS[inc];
            const isActive = state?.activeIncident === inc;
            
            return (
              <button
                key={inc}
                onClick={() => handleSimulate(inc)}
                disabled={isSimulating}
                className={`px-4 py-2.5 border rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 warn-neon-glow font-bold'
                    : 'bg-card/40 border-primary/20 text-foreground/70 hover:text-primary hover:border-primary/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce text-indigo-500' : ''}`} />
                <span>{inc.split('_')[0]}</span>
              </button>
            );
          })}

          <button
            onClick={handleReset}
            disabled={isResetting || state?.activeIncident === 'none'}
            className="px-4 py-2.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-500/20 hover:border-emerald-500 transition-colors disabled:opacity-40"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Reset Nominals</span>
          </button>
        </div>
      </div>

      {/* Manual Telemetry Entry Toggle */}
      <div className="w-full flex justify-end -mt-6">
        <button
          onClick={() => setIsEditorOpen(!isEditorOpen)}
          className={`px-4 py-2 border rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            isEditorOpen 
              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
              : 'bg-card/40 border-primary/20 text-foreground/60 hover:text-primary hover:border-primary/50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isEditorOpen ? 'Close Telemetry Editor' : 'Manually Enter Telemetry Data'}</span>
        </button>
      </div>

      <AnimatePresence>
        {isEditorOpen && (
          <motion.form
            onSubmit={handleCustomSubmit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden w-full glass-panel p-6 rounded-sm border-t-2 border-t-primary/30 flex flex-col gap-6"
          >
            <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs text-primary uppercase tracking-widest">Real-Time Telemetry Data Entry</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Weather Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-foreground/60">Weather Index</label>
                <select
                  value={customWeather}
                  onChange={(e) => setCustomWeather(e.target.value)}
                  className="bg-card/60 border border-primary/25 rounded-sm p-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                >
                  {["Clear", "Overcast", "Light Rain", "Humid", "Windy", "Severe Thunderstorm"].map((w) => (
                    <option key={w} value={w} className="bg-background text-foreground">{w}</option>
                  ))}
                </select>
              </div>

              {/* Energy Grid Load */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-foreground/60">Power Grid Load</label>
                  <span className="font-mono text-xs text-primary">{customEnergy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customEnergy}
                  onChange={(e) => setCustomEnergy(Number(e.target.value))}
                  className="w-full accent-primary bg-card/60 rounded-sm"
                />
              </div>

              {/* General Settings Note */}
              <div className="flex flex-col justify-center text-[10px] text-foreground/40 leading-relaxed font-mono border-l border-primary/10 pl-6">
                <span>* Entering custom telemetry switches the system to MANUAL Incident Command Mode. Ticks are frozen to preserve your inputs.</span>
              </div>
            </div>

            {/* Gates Crowd Density Grid */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-mono uppercase tracking-wider text-foreground/60">Gate Crowd Density (Crowd %)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {state?.gates.map((g) => (
                  <div key={g.id} className="bg-card/40 border border-primary/10 p-3 rounded-sm flex flex-col gap-2">
                    <span className="text-[8px] font-mono text-foreground/50 uppercase truncate" title={g.name}>{g.name.split(' — ')[0]}</span>
                    <div className="flex items-center gap-1.5 justify-between">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={customGates[g.id] ?? 0}
                        onChange={(e) => setCustomGates(prev => ({ ...prev, [g.id]: Math.min(100, Math.max(0, Number(e.target.value))) }))}
                        className="bg-background border border-primary/20 rounded-sm p-1 text-xs text-center w-14 font-mono focus:outline-none focus:border-primary text-foreground"
                      />
                      <span className="text-[10px] text-foreground/40 font-mono">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 border-t border-primary/10 pt-4 mt-2">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 border border-foreground/10 text-foreground/60 hover:text-foreground hover:bg-card/40 transition-all rounded-sm text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2 bg-primary text-black font-mono text-xs uppercase tracking-widest rounded-sm font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] hover:scale-102 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isUpdating ? 'Applying...' : 'Apply Live Entries'}</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Simulator Response Details and Directives */}
      <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Directives Feed */}
        <div className="flex-1 glass-panel p-6 rounded-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-primary/20 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-mono text-xs text-primary uppercase tracking-widest">Active Directives Feed</span>
            </div>
            <span className="font-mono text-[10px] text-foreground/40">
              {isBriefPending ? 'RE-SYNTHESIZING…' : 'COGNITIVE ENGINE V2.6'}
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[460px] pr-2">
            <AnimatePresence mode="popLayout">
              {directives.map((directive) => {
                let borderClass = 'border-primary/10';
                if (directive.severity === 'critical') borderClass = 'border-indigo-500/30 warn-neon-glow';
                if (directive.severity === 'watch') borderClass = 'border-amber-500/25';

                return (
                  <motion.div
                    key={directive.id}
                    initial={{ opacity: 0, x: -15, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    layout
                    className={`p-4 border bg-card/25 rounded-sm flex flex-col gap-2.5 transition-all duration-300 ${borderClass}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-foreground/50">{directive.category}</span>
                      </div>
                      <span className={`text-[8.5px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-sm border ${SEVERITY_STYLE[directive.severity]}`}>
                        {directive.status}
                      </span>
                    </div>
                    <h5 className="text-sm font-medium text-foreground leading-snug">
                      {directive.title}
                    </h5>
                    <p className="text-xs text-foreground/70 font-light leading-relaxed">
                      {directive.detail}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {directives.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-xs font-mono text-foreground/30 py-20">
                Awaiting telemetry stream to compile briefs…
              </div>
            )}
          </div>
        </div>

        {/* Live Audio/Briefing Dispatcher Logs */}
        <div className="w-full lg:w-[360px] glass-panel p-6 rounded-sm flex flex-col justify-between shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col gap-5 h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-primary/20 pb-2">
                <span className="font-mono text-xs text-primary uppercase tracking-widest">GenAI Co-Pilot Logs</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              {/* Telemetry quick metrics */}
              {state && (
                <div className="grid grid-cols-2 gap-3 mb-6 bg-white/5 border border-primary/10 p-3.5 rounded-sm font-mono text-[10px] text-foreground/60">
                  <div className="flex flex-col gap-0.5">
                    <span>WEATHER INDEX:</span>
                    <span className="text-foreground font-medium">{state.weatherCondition}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>GRID LOAD:</span>
                    <span className="text-foreground font-medium">{state.energyLoadPct}%</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>ACTIVE INCIDENT:</span>
                    <span className={`font-bold ${state.activeIncident !== 'none' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {state.activeIncident.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>FAN HEADCOUNT:</span>
                    <span className="text-foreground font-medium">{state.crowdCount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Log message output */}
              <div className="flex flex-col gap-3 font-mono text-[11px] text-foreground/75 leading-relaxed bg-black/60 border border-primary/10 p-4 rounded-sm min-h-[160px] max-h-[220px] overflow-y-auto">
                <p className="text-primary/70">{`>>> Initializing Neural Link... OK`}</p>
                <p className="text-primary/70">{`>>> Telemetry refresh: 2000ms...`}</p>
                {state?.activeIncident !== 'none' ? (
                  <>
                    <p className="text-red-400 font-bold">{`!!! TRIGGER: Incident [${state?.activeIncident.toUpperCase()}] detected`}</p>
                    <p className="text-foreground/80">{`>>> GenAI Action Plan synthesized.`}</p>
                    <p className="text-foreground/80">{`>>> Syncing alerts to fan mobile interfaces.`}</p>
                    <p className="text-foreground/80">{`>>> Adjusting stadium lighting & gate configs.`}</p>
                  </>
                ) : (
                  <>
                    <p className="text-emerald-400">{`>>> Stadium operations nominal.`}</p>
                    <p className="text-foreground/60">{`>>> Passive crowd heat monitoring active.`}</p>
                    <p className="text-foreground/60">{`>>> Transit schedule tracking on line.`}</p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-primary/15 flex flex-col gap-2">
              <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest block">Executive Summary</span>
              <p className="text-xs text-foreground/80 font-light leading-relaxed italic">
                {brief?.summary ?? 'Compiling stadium operational logs...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
