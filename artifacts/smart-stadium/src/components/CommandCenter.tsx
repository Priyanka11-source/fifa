import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetOperationsState,
  useGenerateOperationsBrief,
  getGetOperationsStateQueryKey,
} from '@workspace/api-client-react';
import type { Directive, GateStatus } from '@workspace/api-client-react';

const SEVERITY_STYLE: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  watch: 'bg-primary/20 text-primary border-primary/30',
  info: 'bg-secondary text-secondary-foreground border-primary/20',
};

const GATE_COLOR: Record<GateStatus['status'], string> = {
  critical: 'bg-red-500',
  congested: 'bg-orange-500',
  moderate: 'bg-yellow-500',
  clear: 'bg-emerald-500',
};

function gatePosition(index: number): { top: string; left: string } {
  const positions = [
    { top: '18%', left: '28%' },
    { top: '62%', left: '68%' },
    { top: '38%', left: '58%' },
    { top: '70%', left: '22%' },
    { top: '25%', left: '75%' },
    { top: '50%', left: '40%' },
  ];
  return positions[index % positions.length];
}

export default function CommandCenter() {
  const { data: state } = useGetOperationsState({
    query: { queryKey: getGetOperationsStateQueryKey(), refetchInterval: 5000 },
  });
  const { mutate: generateBrief, data: brief, isPending } = useGenerateOperationsBrief();
  const [directives, setDirectives] = useState<Directive[]>([]);

  useEffect(() => {
    generateBrief();
    const interval = setInterval(() => generateBrief(), 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (brief?.directives) {
      setDirectives(brief.directives);
    }
  }, [brief]);

  return (
    <section className="relative w-full py-32 overflow-hidden bg-background border-t border-primary/10">
      <div className="absolute inset-0 radial-glow opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">

          {/* Narrative */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground">
              Omniscient <br />
              <span className="text-primary italic">Control</span>
            </h2>
            <p className="text-foreground/70 font-light leading-relaxed">
              The stadium thinks before it reacts. Powered by real-time spatial awareness and predictive generative models, operational friction is resolved before fans even notice.
            </p>
            {brief?.summary && (
              <motion.p
                key={brief.summary}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-mono text-primary/80 border-l-2 border-primary/40 pl-3 leading-relaxed"
              >
                {brief.summary}
              </motion.p>
            )}
            <div className="w-12 h-[1px] bg-primary/50 mt-4" />
            {state && (
              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-foreground/50">
                <span>WEATHER: <span className="text-foreground/80">{state.weatherCondition}</span></span>
                <span>ENERGY: <span className="text-foreground/80">{state.energyLoadPct}%</span></span>
              </div>
            )}
          </div>

          {/* Visualization UI */}
          <div className="w-full md:w-2/3 glass-panel rounded-lg p-6 relative overflow-hidden flex flex-col md:flex-row gap-8 min-h-[450px]">

            {/* Heatmap Pitch */}
            <div className="flex-1 relative flex items-center justify-center border border-primary/20 bg-black/40 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjEyLCAxNzUsIDU1LCAwLjE1KSIvPjwvc3ZnPg==')] opacity-30" />

              {/* Stylized Pitch Lines */}
              <div className="w-[80%] h-[60%] border border-primary/30 relative flex items-center justify-center">
                <div className="w-[1px] h-full bg-primary/30 absolute left-1/2 -translate-x-1/2" />
                <div className="w-16 h-16 rounded-full border border-primary/30 absolute" />
                <div className="w-12 h-full border-r border-primary/30 absolute left-0" />
                <div className="w-12 h-full border-l border-primary/30 absolute right-0" />
              </div>

              {/* Live Gate Heat Blobs, driven by real telemetry */}
              {state?.gates.map((gate, i) => {
                const pos = gatePosition(i);
                const size = 40 + gate.crowdPct * 0.9;
                return (
                  <div
                    key={gate.id}
                    className={`absolute rounded-full mix-blend-screen heat-blob ${GATE_COLOR[gate.status]}`}
                    style={{
                      top: pos.top,
                      left: pos.left,
                      width: size,
                      height: size,
                      animationDelay: `${i * 0.4}s`,
                      opacity: 0.55 + gate.crowdPct / 250,
                    }}
                    title={`${gate.name}: ${gate.crowdPct}%`}
                  />
                );
              })}

              {/* Scanline */}
              <motion.div
                className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              <div className="absolute top-3 left-3 flex gap-2 items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-foreground/50 tracking-wider">LIVE THERMAL</span>
              </div>

              {state && (
                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-foreground/40">
                  {state.crowdCount.toLocaleString()} FANS ON SITE
                </div>
              )}
            </div>

            {/* Directive Feed */}
            <div className="w-full md:w-[320px] flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-primary/20 pb-2">
                <span className="font-mono text-xs text-primary uppercase tracking-widest">Active Directives</span>
                <span className={`font-mono text-xs ${isPending ? 'text-primary animate-pulse' : 'text-foreground/40'}`}>
                  {isPending ? 'GENERATING…' : 'SYS.OP.902'}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-3 relative overflow-y-auto max-h-[380px] pr-1">
                <AnimatePresence>
                  {directives.map((directive) => (
                    <motion.div
                      key={directive.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      layout
                      className="p-3 border border-primary/10 bg-background/50 rounded flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-foreground/40">{directive.category}</span>
                        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${SEVERITY_STYLE[directive.severity]}`}>
                          {directive.status}
                        </span>
                      </div>
                      <p className="text-xs text-foreground font-medium leading-relaxed">
                        {directive.title}
                      </p>
                      <p className="text-[11px] text-foreground/60 font-light leading-relaxed">
                        {directive.detail}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {directives.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-xs font-mono text-foreground/30">
                    Synthesizing operational intelligence…
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
