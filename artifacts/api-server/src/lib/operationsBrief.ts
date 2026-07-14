import type { OperationalStateSnapshot, GateState } from "./operationsState";

export type DirectiveCategory =
  | "crowd"
  | "accessibility"
  | "transport"
  | "sustainability"
  | "security"
  | "ticketing";
export type DirectiveSeverity = "info" | "watch" | "critical";
export type DirectiveStatus = "executing" | "monitoring" | "resolved";

export interface Directive {
  id: string;
  title: string;
  detail: string;
  category: DirectiveCategory;
  severity: DirectiveSeverity;
  gate: string | null;
  status: DirectiveStatus;
}

export interface OperationsBriefResult {
  summary: string;
  generatedAt: string;
  directives: Directive[];
}

let sequence = 0;
function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence}`;
}

function crowdSeverity(pct: number): DirectiveSeverity {
  if (pct >= 90) return "critical";
  if (pct >= 70) return "watch";
  return "info";
}

/**
 * Deterministically synthesizes a stadium operations intelligence brief from
 * the live simulated telemetry snapshot. Mirrors the reasoning a GenAI
 * operations copilot would perform: scan telemetry, prioritize the most
 * urgent signals, and emit specific, actionable directives grounded in real
 * numbers rather than generic filler.
 */
export function buildOperationsBrief(state: OperationalStateSnapshot): OperationsBriefResult {
  const directives: Directive[] = [];

  const sortedGates = [...state.gates].sort((a, b) => b.crowdPct - a.crowdPct);
  const busiest = sortedGates[0];
  const quietest = sortedGates[sortedGates.length - 1];

  const congested = sortedGates.filter((g) => g.crowdPct >= 70);
  for (const gate of congested.slice(0, 2)) {
    directives.push({
      id: nextId("crowd"),
      title: `Reroute foot traffic — ${gate.name}`,
      detail: `${gate.name} is at ${gate.crowdPct}% capacity (${gate.status}). GenAI wayfinding is redirecting arriving fans toward ${quietest.name} (${quietest.crowdPct}% capacity) to flatten the surge.`,
      category: "crowd",
      severity: crowdSeverity(gate.crowdPct),
      gate: gate.id,
      status: gate.crowdPct >= 90 ? "executing" : "monitoring",
    });
  }

  const accessibleGate: GateState | undefined = state.gates.find(
    (g) => g.id === "gate-12",
  );
  if (accessibleGate) {
    directives.push({
      id: nextId("accessibility"),
      title: "Accessible route confirmed clear",
      detail: `${accessibleGate.name} is holding at ${accessibleGate.crowdPct}% capacity. Step-free path and lift access to all accessible seating tiers remain unobstructed${
        state.weatherCondition.toLowerCase().includes("rain")
          ? ", covered walkway activated for wet conditions"
          : ""
      }.`,
      category: "accessibility",
      severity: accessibleGate.crowdPct >= 60 ? "watch" : "info",
      gate: accessibleGate.id,
      status: "monitoring",
    });
  }

  const disruptedTransport = state.transport.filter((t) => t.status !== "normal");
  for (const line of disruptedTransport.slice(0, 2)) {
    directives.push({
      id: nextId("transport"),
      title: `${line.status === "disrupted" ? "Disruption" : "Delay"} on ${line.name}`,
      detail: `${line.name} is reporting a ${line.etaMinutes}-minute ETA and marked ${line.status}. Digital signage and the fan app are being updated in real time with the fastest alternative route.`,
      category: "transport",
      severity: line.status === "disrupted" ? "critical" : "watch",
      gate: null,
      status: line.status === "disrupted" ? "executing" : "monitoring",
    });
  }

  if (state.energyLoadPct >= 80) {
    directives.push({
      id: nextId("sustainability"),
      title: "Load-shed non-essential concourse systems",
      detail: `Grid draw at ${state.energyLoadPct}% of peak. GenAI is dimming non-essential concourse lighting and shifting HVAC to eco mode in low-occupancy zones to curb the spike.`,
      category: "sustainability",
      severity: "watch",
      gate: null,
      status: "executing",
    });
  } else if (state.energyLoadPct <= 45) {
    directives.push({
      id: nextId("sustainability"),
      title: "Energy profile nominal",
      detail: `Grid draw holding at ${state.energyLoadPct}% of peak, well within the sustainability target for this attendance level. No load-shedding required.`,
      category: "sustainability",
      severity: "info",
      gate: null,
      status: "resolved",
    });
  }

  if (busiest.crowdPct >= 65) {
    directives.push({
      id: nextId("ticketing"),
      title: `Pop-up ticket desk suggested near ${busiest.name}`,
      detail: `Queue pressure at ${busiest.name} (${busiest.crowdPct}%) is likely to slow ticket re-issues. Recommend staging a mobile ticketing kiosk nearby to intercept the line before it backs into the concourse.`,
      category: "ticketing",
      severity: "info",
      gate: busiest.id,
      status: "monitoring",
    });
  }

  if (directives.length < 3) {
    directives.push({
      id: nextId("security"),
      title: "Perimeter and crowd flow nominal",
      detail: `All ${state.gates.length} monitored gates are within safe thermal and crowd-density thresholds. GenAI continues passive monitoring at 2-second refresh.`,
      category: "security",
      severity: "info",
      gate: null,
      status: "monitoring",
    });
  }

  const severityRank: Record<DirectiveSeverity, number> = { critical: 0, watch: 1, info: 2 };
  directives.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  const summary = `${busiest.name} is the current pressure point at ${busiest.crowdPct}% capacity under ${state.weatherCondition.toLowerCase()} conditions; ${
    disruptedTransport.length > 0
      ? `${disruptedTransport.length} transport line${disruptedTransport.length > 1 ? "s" : ""} running behind schedule`
      : "all transport lines on schedule"
  } while grid load sits at ${state.energyLoadPct}%.`;

  return {
    summary,
    generatedAt: new Date().toISOString(),
    directives: directives.slice(0, 5),
  };
}
