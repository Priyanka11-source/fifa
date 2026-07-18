import React from 'react';
import { motion } from 'framer-motion';
import { useGetOperationsState, getGetOperationsStateQueryKey } from '@workspace/api-client-react';
import { Zap, Users, Train, Leaf, TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
      icon: Zap,
    },
    {
      label: 'Fans On Site',
      value: state ? (state.crowdCount / 1000).toFixed(1) : '—',
      unit: 'k',
      sub: 'Live headcount estimate',
      trend: 'up',
      icon: Users,
    },
    {
      label: 'Transport Health',
      value: state ? String(state.transport.filter((t) => t.status === 'normal').length) : '—',
      unit: `/ ${state?.transport.length ?? 4} on time`,
      sub: state ? state.weatherCondition : 'Loading…',
      trend: 'stable',
      icon: Train,
    },
    { 
      label: 'Carbon Offset', 
      value: '8.4', 
      unit: 't', 
      sub: 'Matchday total', 
      trend: 'up' as const,
      icon: Leaf,
    }
  ];

  const COLOR_SCHEMES = [
    {
      glow: 'shadow-neon-orange shadow-neon-orange-hover border-t-neon-orange',
      text: 'text-neon-orange',
      label: 'text-neon-orange/60',
      unit: 'text-neon-orange/80',
      iconBg: 'bg-neon-orange/10 border-neon-orange/20',
      bar: 'from-neon-orange to-neon-gold',
    },
    {
      glow: 'shadow-neon-cyan shadow-neon-cyan-hover border-t-neon-cyan',
      text: 'text-neon-cyan',
      label: 'text-neon-cyan/60',
      unit: 'text-neon-cyan/80',
      iconBg: 'bg-neon-cyan/10 border-neon-cyan/20',
      bar: 'from-neon-cyan to-neon-emerald',
    },
    {
      glow: 'shadow-neon-emerald shadow-neon-emerald-hover border-t-neon-emerald',
      text: 'text-neon-emerald',
      label: 'text-neon-emerald/60',
      unit: 'text-neon-emerald/80',
      iconBg: 'bg-neon-emerald/10 border-neon-emerald/20',
      bar: 'from-neon-emerald to-neon-cyan',
    },
    {
      glow: 'shadow-neon-pink shadow-neon-pink-hover border-t-neon-pink',
      text: 'text-neon-pink',
      label: 'text-neon-pink/60',
      unit: 'text-neon-pink/80',
      iconBg: 'bg-neon-pink/10 border-neon-pink/20',
      bar: 'from-neon-pink to-neon-purple',
    }
  ];

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-primary" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-secondary-foreground" />;
    return <Minus className="w-3.5 h-3.5 text-foreground/40" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {METRICS.map((metric, i) => {
        const scheme = COLOR_SCHEMES[i % COLOR_SCHEMES.length];
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            whileHover={{ y: -2 }}
            className={`glass-panel p-8 rounded-sm group hover:bg-white/[0.03] flex flex-col border-t-2 ${scheme.glow} transition-all duration-300`}
          >
            {/* Header row with icon and label */}
            <div className="flex items-center justify-between mb-5">
              <div className={`w-8 h-8 rounded-sm border flex items-center justify-center ${scheme.iconBg}`}>
                <Icon className={`w-4 h-4 ${scheme.text}`} />
              </div>
              <span className={`font-mono text-[9px] uppercase tracking-[0.2em] ${scheme.label}`}>{metric.label}</span>
            </div>
            
            {/* Big value */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-5xl font-serif font-bold transition-all duration-300 ${scheme.text}`}>
                {metric.value}
              </span>
              <span className={`font-mono text-sm ${scheme.unit}`}>{metric.unit}</span>
            </div>

            {/* Mini bar for visual interest */}
            <div className="w-full h-0.5 bg-white/5 rounded-full mt-3 mb-4 overflow-hidden">
              <motion.div 
                initial={{ width: '0%' }}
                whileInView={{ width: `${40 + i * 15}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 1.2, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${scheme.bar}`}
              />
            </div>
            
            {/* Footer trend */}
            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
              <TrendIcon trend={metric.trend ?? 'stable'} />
              <span className="text-xs font-light text-foreground/55">{metric.sub}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
