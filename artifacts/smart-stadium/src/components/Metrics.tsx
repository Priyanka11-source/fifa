import React from 'react';
import { motion } from 'framer-motion';
import { useGetOperationsState, getGetOperationsStateQueryKey } from '@workspace/api-client-react';

export default function Metrics() {
  const { data: state } = useGetOperationsState({
    query: { queryKey: getGetOperationsStateQueryKey(), refetchInterval: 5000 },
  });

  const METRICS = [
    {
      label: 'Energy Load',
      value: state ? String(state.energyLoadPct) : '—',
      unit: '%',
      sub: state && state.energyLoadPct >= 80 ? 'Load-shedding active' : 'Within target',
      trend: state && state.energyLoadPct >= 80 ? 'up' : 'down',
    },
    {
      label: 'Fans On Site',
      value: state ? (state.crowdCount / 1000).toFixed(1) : '—',
      unit: 'k',
      sub: 'Live headcount estimate',
      trend: 'up',
    },
    {
      label: 'Transport Health',
      value: state ? String(state.transport.filter((t) => t.status === 'normal').length) : '—',
      unit: `/ ${state?.transport.length ?? 4} on time`,
      sub: state ? state.weatherCondition : 'Loading…',
      trend: 'stable',
    },
    { label: 'Carbon Offset', value: '8.4', unit: 't', sub: 'Matchday total', trend: 'up' as const }
  ];

  return (
    <section className="relative w-full py-32 bg-background overflow-hidden border-t border-primary/10">
      {/* Decorative Video Background for depth */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="object-cover w-full h-full filter blur-[4px] grayscale sepia-[0.5] hue-rotate-[40deg]"
        >
          <source src="/videos/stadium-hero-2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
        <div className="text-center mb-20 max-w-2xl">
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6">
            Metrics of <span className="text-primary italic">Scale</span>
          </h2>
          <p className="text-foreground/70 font-light">
            A living organism composed of concrete, light, and data. Every joule of energy, every decibel of sound is measured, modeled, and perfected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="glass-panel p-8 rounded-sm group hover:bg-primary/5 transition-colors border-l-2 border-l-primary/30 hover:border-l-primary flex flex-col"
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40 mb-4">{metric.label}</span>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-serif text-foreground group-hover:text-primary transition-colors">
                  {metric.value}
                </span>
                <span className="text-primary/70 font-mono text-sm">{metric.unit}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-primary/10">
                {metric.trend === 'down' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-secondary-foreground">
                    <path d="M12 5V19M12 19L5 12M12 19L19 12" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
                  </svg>
                )}
                {metric.trend === 'up' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary">
                    <path d="M12 19V5M12 5L5 12M12 5L19 12" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
                  </svg>
                )}
                {metric.trend === 'stable' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-foreground/50">
                    <path d="M5 12H19" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
                  </svg>
                )}
                <span className="text-xs font-light text-foreground/60">{metric.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-20 px-8 py-4 border border-primary/20 rounded-full inline-flex items-center gap-4 bg-background/50 backdrop-blur gold-glow-hover cursor-pointer transition-all"
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm tracking-widest uppercase font-medium text-foreground">Access Full Telemetry</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
