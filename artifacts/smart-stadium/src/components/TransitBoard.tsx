import React from "react";
import {
  Train,
  Bus,
  Car,
  ParkingSquare,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import type { TransportLine } from "@workspace/api-client-react";

interface TransitBoardProps {
  transport?: TransportLine[];
  activeIncident?: string;
}

const TRANSIT_ICONS = {
  rail: Train,
  shuttle: Bus,
  rideshare: Car,
  parking: ParkingSquare,
};

const MODE_LABELS = {
  rail: "Metro Rail",
  shuttle: "Shuttle Bus",
  rideshare: "Rideshare Zone",
  parking: "Parking structure",
};

export default function TransitBoard({
  transport = [],
  activeIncident = "none",
}: TransitBoardProps) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Board Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono text-neon-orange uppercase tracking-[0.2em] mb-1 block">
            Live Departures
          </span>
          <h3 className="font-serif text-3xl text-foreground">
            Transit & Mobility Board
          </h3>
          <p className="text-xs text-foreground/60 mt-1 font-light leading-relaxed">
            Live telemetry from central transit controls. Plan your post-match
            egress routes using GenAI coordination.
          </p>
        </div>
        <div className="flex gap-4 font-mono text-xs text-foreground/50 border border-white/10 px-4 py-2 bg-[#0a081a] rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.02)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-emerald shadow-[0_0_8px_rgba(112,224,0,0.8)]" />
            <span className="text-neon-emerald">NOMINAL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-orange shadow-[0_0_8px_rgba(245,120,65,0.8)]" />
            <span className="text-neon-orange">DELAYED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse shadow-[0_0_8px_rgba(255,94,98,0.8)]" />
            <span className="text-neon-pink">DISRUPTED</span>
          </div>
        </div>
      </div>

      {/* Transit Lines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {transport.map((line) => {
          const Icon =
            TRANSIT_ICONS[line.mode as keyof typeof TRANSIT_ICONS] || Bus;
          const label =
            MODE_LABELS[line.mode as keyof typeof MODE_LABELS] || "Transit";

          let cardStyle =
            "border-t-neon-cyan shadow-neon-cyan shadow-neon-cyan-hover";
          let statusColor =
            "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20";
          let iconColor = "text-neon-cyan";

          if (line.status === "disrupted") {
            cardStyle =
              "border-t-neon-pink shadow-neon-pink shadow-neon-pink-hover";
            statusColor =
              "text-neon-pink bg-neon-pink/10 border-neon-pink/20 animate-pulse";
            iconColor = "text-neon-pink";
          } else if (line.status === "delayed") {
            cardStyle =
              "border-t-neon-orange shadow-neon-orange shadow-neon-orange-hover";
            statusColor =
              "text-neon-orange bg-neon-orange/10 border-neon-orange/20";
            iconColor = "text-neon-orange";
          } else {
            cardStyle =
              "border-t-neon-emerald shadow-neon-emerald shadow-neon-emerald-hover";
            statusColor =
              "text-neon-emerald bg-neon-emerald/10 border-neon-emerald/20";
            iconColor = "text-neon-emerald";
          }

          return (
            <div
              key={line.name}
              className={`p-6 border-t-2 bg-[#0b081c]/55 backdrop-blur rounded-sm flex flex-col gap-4 transition-all duration-300 ${cardStyle}`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`w-10 h-10 border border-white/10 rounded flex items-center justify-center bg-black/40 ${iconColor} shadow-[0_0_10px_rgba(255,255,255,0.02)]`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${statusColor}`}
                >
                  {line.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-foreground/45 uppercase tracking-wider block mb-0.5">
                  {label}
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  {line.name}
                </h4>
              </div>

              <div className="flex items-baseline gap-2.5 mt-2 border-t border-primary/5 pt-4">
                {line.mode === "parking" ? (
                  <>
                    <span
                      className={`text-3xl font-serif font-bold ${iconColor}`}
                    >
                      84
                    </span>
                    <span className="text-[10px] font-mono text-foreground/40 uppercase">
                      % occupied
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className={`text-3xl font-serif font-bold ${iconColor}`}
                    >
                      {line.etaMinutes === 0 ? "Boarding" : line.etaMinutes}
                    </span>
                    {line.etaMinutes > 0 && (
                      <span className="text-[10px] font-mono text-foreground/40 uppercase">
                        mins
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* AI helper tip inside the card */}
              <div className="mt-auto border-t border-primary/5 pt-3 flex gap-2 items-start text-[11px] text-foreground/50 font-light leading-relaxed">
                <Clock className={`w-3.5 h-3.5 ${iconColor} shrink-0 mt-0.5`} />
                <span>
                  {line.status === "disrupted" &&
                    "AI: Take Shuttle Loop A to intercept train further down the line."}
                  {line.status === "delayed" &&
                    "AI: Flow congestion expected. Consider boarding 5 mins early."}
                  {line.status === "normal" &&
                    "AI: Boarding intervals optimal. Direct pathways clear."}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Recommendation Panel */}
      <div className="p-5 border-t-2 border-t-neon-purple bg-gradient-to-r from-neon-purple/10 via-[#0c081e] to-neon-pink/5 rounded-sm flex flex-col md:flex-row items-start md:items-center gap-4 relative overflow-hidden shadow-neon-purple shadow-neon-purple-hover">
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-neon-purple/10 to-transparent pointer-events-none" />
        <div className="w-10 h-10 rounded-full border border-neon-purple/30 bg-background flex items-center justify-center text-neon-purple shrink-0 shadow-[0_0_10px_rgba(131,56,236,0.3)] animate-pulse">
          <Clock className="w-5 h-5" />
        </div>
        <div className="flex-1 flex flex-col gap-1 z-10">
          <h5 className="text-xs uppercase font-mono text-neon-purple tracking-widest font-bold">
            GenAI Mobility Copilot Recommendation
          </h5>
          <p className="text-xs text-foreground/80 font-light leading-relaxed">
            {activeIncident === "transit_disruption"
              ? "ALERT: Metro Gold Line service is suspended. Central signages are rerouting all northbound passengers to Shuttle Loop A. Extra coaches deployed at Gate 4 concourse pickup corridor."
              : activeIncident === "storm"
                ? "WEATHER ADVISORY: Rains may cause rideshare delays. We recommend using Metro Gold Line (departing in 4 mins) or the covered Parking Structure shuttle loop."
                : "Egress conditions nominal. The Gold Line Metro remains the most carbon-efficient transit option today, saving approximately 1.4kg of CO2 per passenger compared to rideshare."}
          </p>
        </div>
      </div>
    </div>
  );
}
