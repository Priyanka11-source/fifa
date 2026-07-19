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
export function buildOperationsBrief(
  state: OperationalStateSnapshot,
): OperationsBriefResult {
  const directives: Directive[] = [];

  const sortedGates = [...state.gates].sort((a, b) => b.crowdPct - a.crowdPct);
  const busiest = sortedGates[0];
  const quietest = sortedGates[sortedGates.length - 1];
  const congested = sortedGates.filter((g) => g.crowdPct >= 70);

  // 1. Inject specific directives for active incidents
  if (state.activeIncident && state.activeIncident !== "none") {
    if (state.activeIncident === "storm") {
      directives.push({
        id: nextId("security"),
        title: "Severe weather warning: Seek shelter",
        detail:
          "Lightning detected within 5 miles. Directing fans to main concourse shelters. High-elevation walkways closed for safety.",
        category: "security",
        severity: "critical",
        gate: null,
        status: "executing",
      });
      directives.push({
        id: nextId("transport"),
        title: "Reroute shuttle loop transit",
        detail:
          "Severe rain starting. Diverting active parking shuttles to covered lower terminal to safeguard volunteers and fans.",
        category: "transport",
        severity: "watch",
        gate: "gate-4",
        status: "executing",
      });
      directives.push({
        id: nextId("sustainability"),
        title: "Power grid load-shedding active",
        detail:
          "Grid load at 88%. Concourse lighting dimmed by 30% and outdoor digital displays shifted to low-power emergency mode.",
        category: "sustainability",
        severity: "watch",
        gate: null,
        status: "executing",
      });
    } else if (state.activeIncident === "transit_disruption") {
      directives.push({
        id: nextId("transport"),
        title: "Metro Gold Line outage: Service suspended",
        detail:
          "Signal failure on Gold Line. Activating backup shuttle loops between West Plaza and Downtown station. Delay ETA 25 min.",
        category: "transport",
        severity: "critical",
        gate: null,
        status: "executing",
      });
      directives.push({
        id: nextId("crowd"),
        title: "Divert outbound flows to Rideshare Zone",
        detail:
          "Metro disruption will cause heavy post-match delays. Dynamic signs rerouting departing fans toward Rideshare Zone B.",
        category: "crowd",
        severity: "watch",
        gate: "gate-4",
        status: "executing",
      });
    } else if (state.activeIncident === "crowd_surge") {
      directives.push({
        id: nextId("crowd"),
        title: "Gate 4 & Gate 14 surge: Open overflows",
        detail:
          "Concourse ingress pressure exceeded 90%. Opening emergency gates 4B and 14B to double entry lane throughput.",
        category: "crowd",
        severity: "critical",
        gate: "gate-4",
        status: "executing",
      });
      directives.push({
        id: nextId("security"),
        title: "Deploy crowd volunteers to West Plaza",
        detail:
          "Deploying 15 additional safety stewards to Gate 4 concourse corridor to assist with line forming and ticket scans.",
        category: "security",
        severity: "watch",
        gate: "gate-4",
        status: "executing",
      });
      directives.push({
        id: nextId("ticketing"),
        title: "Redirect mobile ticket support",
        detail:
          "Congestion at Gate 14. Setting up mobile ticket desk 6 to intercept fans with QR scan issues before they block lanes.",
        category: "ticketing",
        severity: "info",
        gate: "gate-14",
        status: "executing",
      });
    } else if (state.activeIncident === "grid_failure") {
      directives.push({
        id: nextId("sustainability"),
        title: "Grid substation failure: Backup active",
        detail:
          "Primary power lost. Auxiliary diesel generator banks 1 and 2 started. Critical pitch illumination and safety systems online.",
        category: "sustainability",
        severity: "critical",
        gate: null,
        status: "executing",
      });
      directives.push({
        id: nextId("sustainability"),
        title: "Concourse HVAC reduced to 50%",
        detail:
          "Load-shedding active. HVAC offline in low-occupancy service areas. Advise venue staff to keep gates open for cross-ventilation.",
        category: "sustainability",
        severity: "watch",
        gate: null,
        status: "executing",
      });
    }
  }

  // 2. Append normal telemetry-based directives if space permits (up to 5 total)
  if (directives.length < 5) {
    for (const gate of congested) {
      if (directives.length >= 5) break;
      // Skip if this gate is already covered in active incident
      if (directives.some((d) => d.gate === gate.id)) continue;

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
  }

  const accessibleGateState = state.gates.find((g) => g.id === "gate-12");
  if (accessibleGateState && directives.length < 5) {
    directives.push({
      id: nextId("accessibility"),
      title: "Accessible route confirmed clear",
      detail: `${accessibleGateState.name} is holding at ${accessibleGateState.crowdPct}% capacity. Step-free path and lift access to all accessible seating tiers remain unobstructed${
        state.weatherCondition.toLowerCase().includes("rain")
          ? ", covered walkway activated for wet conditions"
          : ""
      }.`,
      category: "accessibility",
      severity: accessibleGateState.crowdPct >= 60 ? "watch" : "info",
      gate: accessibleGateState.id,
      status: "monitoring",
    });
  }

  const disruptedTransport = state.transport.filter(
    (t) => t.status !== "normal",
  );
  if (directives.length < 5) {
    for (const line of disruptedTransport) {
      if (directives.length >= 5) break;
      if (directives.some((d) => d.title.includes(line.name))) continue;

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

  const severityRank: Record<DirectiveSeverity, number> = {
    critical: 0,
    watch: 1,
    info: 2,
  };
  directives.sort(
    (a, b) => severityRank[a.severity] - severityRank[b.severity],
  );

  let summary = "";
  if (state.activeIncident && state.activeIncident !== "none") {
    summary = `CRITICAL INCIDENT ACTIVE: [${state.activeIncident.toUpperCase()}]. Stadium operations shifted to emergency mitigation protocol. Weather: ${state.weatherCondition}. Grid Load: ${state.energyLoadPct}%.`;
  } else {
    summary = `${busiest.name} is the current pressure point at ${busiest.crowdPct}% capacity under ${state.weatherCondition.toLowerCase()} conditions; ${
      disruptedTransport.length > 0
        ? `${disruptedTransport.length} transport line${disruptedTransport.length > 1 ? "s" : ""} running behind schedule`
        : "all transport lines on schedule"
    } while grid load sits at ${state.energyLoadPct}%.`;
  }

  return {
    summary,
    generatedAt: new Date().toISOString(),
    directives: directives.slice(0, 5),
  };
}
