import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BatteryCharging, Leaf, Droplet, Sun, Zap, Trash2 } from "lucide-react";

interface SustainabilityPanelProps {
  energyLoad?: number;
  activeIncident?: string;
}

const HISTORICAL_ENERGY_DATA = [
  { hour: "14:00", solar: 1.1, grid: 2.3 },
  { hour: "15:00", solar: 1.2, grid: 2.5 },
  { hour: "16:00", solar: 1.4, grid: 2.8 },
  { hour: "17:00", solar: 1.3, grid: 3.1 },
  { hour: "18:00", solar: 1.0, grid: 3.5 },
  { hour: "19:00", solar: 0.6, grid: 4.2 },
  { hour: "20:00", solar: 0.2, grid: 4.8 },
];

export default function SustainabilityPanel({
  energyLoad = 64,
  activeIncident = "none",
}: SustainabilityPanelProps) {
  // Compute simulation adjustments
  const isStorm = activeIncident === "storm";
  const isGridFailure = activeIncident === "grid_failure";

  const currentSolarGeneration = isStorm ? 0.2 : isGridFailure ? 0.9 : 1.2; // MW
  const batteryReserveLevel = isStorm ? 92 : isGridFailure ? 78 : 85; // %
  const rainwaterReclaimed = isStorm ? 45000 : 12000; // Liters today

  const chartData = HISTORICAL_ENERGY_DATA.map((d, index) => {
    if (index === HISTORICAL_ENERGY_DATA.length - 1) {
      return {
        ...d,
        solar: currentSolarGeneration,
        grid: isGridFailure ? 0.4 : isStorm ? 4.9 : d.grid,
      };
    }
    return d;
  });

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-neon-emerald uppercase tracking-[0.2em] mb-1 block">
          Green Telemetry
        </span>
        <h3 className="font-serif text-3xl text-foreground">
          Sustainability & Energy Dashboard
        </h3>
        <p className="text-xs text-foreground/60 mt-1 font-light leading-relaxed">
          Tracking the environmental footprint of the FIFA World Cup 2026.
          Powered by micro-generation solar loops and wastewater recycling.
        </p>
      </div>

      {/* Sustainability Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Solar Generation */}
        <div className="glass-panel p-6 rounded-sm flex flex-col gap-4 border-t-2 border-t-neon-gold shadow-neon-gold shadow-neon-gold-hover hover:bg-white/5">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 border border-neon-gold/20 rounded flex items-center justify-center bg-black/40 text-neon-gold">
              <Sun className="w-5 h-5" />
            </div>
            <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-neon-gold/20 text-neon-gold bg-neon-gold/5">
              Micro-Gen Solar
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/45 uppercase tracking-wider block mb-0.5">
              Solar Output
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-serif font-bold text-neon-gold">
                {currentSolarGeneration}
              </span>
              <span className="text-xs font-mono text-foreground/80">MW</span>
            </div>
          </div>
          <div className="text-[11px] text-foreground/50 font-light border-t border-primary/5 pt-3 leading-relaxed">
            Supplying {isStorm ? "5%" : "34%"} of active stadium electrical
            demand.{" "}
            {isStorm
              ? "Cloud cover throttling collectors."
              : "Optimum absorption index."}
          </div>
        </div>

        {/* Battery Reserve */}
        <div className="glass-panel p-6 rounded-sm flex flex-col gap-4 border-t-2 border-t-neon-emerald shadow-neon-emerald shadow-neon-emerald-hover hover:bg-white/5">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 border border-neon-emerald/20 rounded flex items-center justify-center bg-black/40 text-neon-emerald">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-neon-emerald/20 text-neon-emerald bg-neon-emerald/5">
              Power Reserve
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/45 uppercase tracking-wider block mb-0.5">
              Battery Bank Storage
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-serif font-bold text-neon-emerald">
                {batteryReserveLevel}
              </span>
              <span className="text-xs font-mono text-foreground/80">
                % capacity
              </span>
            </div>
          </div>
          <div className="text-[11px] text-foreground/50 font-light border-t border-primary/5 pt-3 leading-relaxed">
            {isGridFailure
              ? "GRID FAILURE: Discharging batteries. ETA depletion: 4.8 hrs."
              : "Nominal grid stabilization buffer. Emergency reserve ready."}
          </div>
        </div>

        {/* Rainwater Harvesting */}
        <div className="glass-panel p-6 rounded-sm flex flex-col gap-4 border-t-2 border-t-neon-cyan shadow-neon-cyan shadow-neon-cyan-hover hover:bg-white/5">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 border border-neon-cyan/20 rounded flex items-center justify-center bg-black/40 text-neon-cyan">
              <Droplet className="w-5 h-5" />
            </div>
            <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-neon-cyan/20 text-neon-cyan bg-neon-cyan/5">
              Water Reclaimed
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/45 uppercase tracking-wider block mb-0.5">
              Rainwater Collector
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-serif font-bold text-neon-cyan">
                {(rainwaterReclaimed / 1000).toFixed(1)}k
              </span>
              <span className="text-xs font-mono text-foreground/80">
                Liters
              </span>
            </div>
          </div>
          <div className="text-[11px] text-foreground/50 font-light border-t border-primary/5 pt-3 leading-relaxed">
            {isStorm
              ? "STORM WARNING: Maximum intake capture. Drainage reservoirs opening."
              : "Recycling loop nominal. Offsetting potable municipal water."}
          </div>
        </div>
      </div>

      {/* Energy Grid Flow - Chart Section */}
      <div className="glass-panel p-6 rounded-sm flex flex-col gap-6 relative overflow-hidden">
        <div>
          <span className="text-[10px] font-mono text-neon-emerald uppercase tracking-[0.2em] mb-1 block">
            Live Load balance
          </span>
          <h4 className="text-lg font-medium text-foreground">
            Peak Demand vs. Solar Generation (MW)
          </h4>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="solarGlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(245, 176, 65, 0.4)" />
                  <stop offset="95%" stopColor="rgba(245, 176, 65, 0)" />
                </linearGradient>
                <linearGradient id="gridGlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(0, 245, 212, 0.3)" />
                  <stop offset="95%" stopColor="rgba(0, 245, 212, 0)" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.03)"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                stroke="rgba(255,255,255,0.4)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a081c",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                  fontSize: "11px",
                }}
              />
              <Area
                type="monotone"
                dataKey="grid"
                name="Grid Draw"
                stroke="var(--color-neon-cyan)"
                fillOpacity={1}
                fill="url(#gridGlowGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="solar"
                name="Solar Output"
                stroke="var(--color-neon-gold)"
                fillOpacity={1}
                fill="url(#solarGlowGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-6 font-mono text-[10px] text-foreground/50 border-t border-primary/5 pt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 bg-neon-gold rounded-sm" />
            <span className="text-neon-gold">SOLAR PRODUCTION</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 bg-neon-cyan rounded-sm" />
            <span className="text-neon-cyan">GRID ENERGY CONSUMPTION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
