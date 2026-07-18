export type GateStatusValue = "clear" | "moderate" | "congested" | "critical";
export type TransportMode = "rail" | "shuttle" | "rideshare" | "parking";
export type TransportStatusValue = "normal" | "delayed" | "disrupted";

export interface GateState {
  id: string;
  name: string;
  crowdPct: number;
  status: GateStatusValue;
}

export interface TransportLineState {
  name: string;
  mode: TransportMode;
  status: TransportStatusValue;
  etaMinutes: number;
}

export interface OperationalStateSnapshot {
  timestamp: string;
  weatherCondition: string;
  energyLoadPct: number;
  crowdCount: number;
  activeIncident: string;
  gates: GateState[];
  transport: TransportLineState[];
}

const WEATHER_CONDITIONS = ["Clear", "Overcast", "Light Rain", "Humid", "Windy"];

export type IncidentType = "none" | "storm" | "transit_disruption" | "crowd_surge" | "grid_failure";
let activeIncident: IncidentType = "none";
let isManualOverride = false;

export function getActiveIncident(): IncidentType {
  return activeIncident;
}

export function setActiveIncident(type: IncidentType): void {
  isManualOverride = false;
  activeIncident = type;
  if (type === "storm") {
    weatherCondition = "Severe Thunderstorm";
    energyLoadPct = 88;
    for (const gate of gates) {
      gate.crowdPct = Math.min(95, gate.crowdPct + 25);
      gate.status = statusForCrowdPct(gate.crowdPct);
    }
    for (const line of transport) {
      if (line.mode === "shuttle" || line.mode === "rideshare") {
        line.status = "delayed";
        line.etaMinutes = 18;
      }
    }
  } else if (type === "transit_disruption") {
    for (const line of transport) {
      if (line.mode === "rail") {
        line.status = "disrupted";
        line.etaMinutes = 25;
      }
    }
  } else if (type === "crowd_surge") {
    const gate4 = gates.find(g => g.id === "gate-4");
    if (gate4) {
      gate4.crowdPct = 98;
      gate4.status = "critical";
    }
    const gate14 = gates.find(g => g.id === "gate-14");
    if (gate14) {
      gate14.crowdPct = 92;
      gate14.status = "critical";
    }
  } else if (type === "grid_failure") {
    energyLoadPct = 97;
  }
}

export function resetActiveIncident(): void {
  isManualOverride = false;
  activeIncident = "none";
  weatherCondition = "Clear";
  energyLoadPct = 60;
  for (const gate of gates) {
    gate.crowdPct = 25 + Math.floor(Math.random() * 25);
    gate.status = statusForCrowdPct(gate.crowdPct);
  }
  for (const line of transport) {
    line.status = "normal";
    line.etaMinutes = 2 + Math.floor(Math.random() * 6);
  }
}

function statusForCrowdPct(pct: number): GateStatusValue {
  if (pct >= 90) return "critical";
  if (pct >= 70) return "congested";
  if (pct >= 40) return "moderate";
  return "clear";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomWalk(value: number, magnitude: number, min: number, max: number): number {
  const delta = (Math.random() - 0.5) * 2 * magnitude;
  return clamp(value + delta, min, max);
}

interface MutableGate extends GateState {}
interface MutableTransport extends TransportLineState {}

const gates: MutableGate[] = [
  { id: "gate-1", name: "Gate 1 — North Concourse", crowdPct: 38, status: "moderate" },
  { id: "gate-4", name: "Gate 4 — West Plaza", crowdPct: 72, status: "congested" },
  { id: "gate-6", name: "Gate 6 — Family Entrance", crowdPct: 21, status: "clear" },
  { id: "gate-9", name: "Gate 9 — VIP South", crowdPct: 46, status: "moderate" },
  { id: "gate-12", name: "Gate 12 — Accessible Entrance", crowdPct: 18, status: "clear" },
  { id: "gate-14", name: "Gate 14 — East Concourse", crowdPct: 61, status: "moderate" },
];

const transport: MutableTransport[] = [
  { name: "Metro Gold Line", mode: "rail", status: "normal", etaMinutes: 4 },
  { name: "Fan Shuttle Loop A", mode: "shuttle", status: "normal", etaMinutes: 7 },
  { name: "Rideshare Pickup Zone", mode: "rideshare", status: "delayed", etaMinutes: 12 },
  { name: "North Parking Structure", mode: "parking", status: "normal", etaMinutes: 0 },
];

let weatherCondition = "Clear";
let energyLoadPct = 64;

function tick(): void {
  if (isManualOverride) {
    return;
  }
  if (activeIncident === "none") {
    for (const gate of gates) {
      gate.crowdPct = Math.round(randomWalk(gate.crowdPct, 6, 5, 99));
      gate.status = statusForCrowdPct(gate.crowdPct);
    }

    for (const line of transport) {
      line.etaMinutes = Math.max(0, Math.round(randomWalk(line.etaMinutes, 2, 0, 20)));
      if (line.etaMinutes > 14) {
        line.status = "disrupted";
      } else if (line.etaMinutes > 9) {
        line.status = "delayed";
      } else {
        line.status = "normal";
      }
    }

    energyLoadPct = Math.round(randomWalk(energyLoadPct, 3, 30, 95));

    if (Math.random() < 0.08) {
      weatherCondition =
        WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)] ??
        weatherCondition;
    }
  } else {
    // Keep simulation locked to extreme telemetry
    if (activeIncident === "storm") {
      weatherCondition = "Severe Thunderstorm";
      energyLoadPct = Math.round(randomWalk(energyLoadPct, 1, 85, 95));
      for (const gate of gates) {
        gate.crowdPct = Math.round(randomWalk(gate.crowdPct, 2, 70, 95));
        gate.status = statusForCrowdPct(gate.crowdPct);
      }
      for (const line of transport) {
        if (line.mode === "shuttle" || line.mode === "rideshare") {
          line.status = "delayed";
          line.etaMinutes = Math.max(14, Math.round(randomWalk(line.etaMinutes, 1, 14, 24)));
        } else {
          line.etaMinutes = Math.max(0, Math.round(randomWalk(line.etaMinutes, 1, 2, 8)));
          line.status = "normal";
        }
      }
    } else if (activeIncident === "transit_disruption") {
      for (const line of transport) {
        if (line.mode === "rail") {
          line.status = "disrupted";
          line.etaMinutes = Math.max(22, Math.round(randomWalk(line.etaMinutes, 1, 22, 30)));
        }
      }
    } else if (activeIncident === "crowd_surge") {
      const gate4 = gates.find(g => g.id === "gate-4");
      if (gate4) {
        gate4.crowdPct = Math.max(92, Math.round(randomWalk(gate4.crowdPct, 1, 92, 99)));
        gate4.status = "critical";
      }
      const gate14 = gates.find(g => g.id === "gate-14");
      if (gate14) {
        gate14.crowdPct = Math.max(88, Math.round(randomWalk(gate14.crowdPct, 1, 88, 96)));
        gate14.status = "critical";
      }
    } else if (activeIncident === "grid_failure") {
      energyLoadPct = Math.max(94, Math.round(randomWalk(energyLoadPct, 1, 94, 99)));
    }
  }
}

export function updateOperationalState(data: {
  weatherCondition?: string;
  energyLoadPct?: number;
  activeIncident?: IncidentType;
  gates?: { id: string; crowdPct: number }[];
  transport?: { name: string; etaMinutes: number; status: TransportStatusValue }[];
}): void {
  isManualOverride = true;
  activeIncident = data.activeIncident ?? "none";
  if (data.weatherCondition !== undefined) weatherCondition = data.weatherCondition;
  if (data.energyLoadPct !== undefined) energyLoadPct = data.energyLoadPct;
  if (data.gates !== undefined) {
    for (const gateInput of data.gates) {
      const gate = gates.find(g => g.id === gateInput.id);
      if (gate) {
        gate.crowdPct = gateInput.crowdPct;
        gate.status = statusForCrowdPct(gate.crowdPct);
      }
    }
  }
  if (data.transport !== undefined) {
    for (const transInput of data.transport) {
      const line = transport.find(t => t.name === transInput.name);
      if (line) {
        line.etaMinutes = transInput.etaMinutes;
        line.status = transInput.status;
      }
    }
  }
}

export function getOperationalState(): OperationalStateSnapshot {
  tick();

  const crowdCount = Math.round(
    gates.reduce((sum, gate) => sum + gate.crowdPct, 0) * 420,
  );

  return {
    timestamp: new Date().toISOString(),
    weatherCondition,
    energyLoadPct,
    crowdCount,
    activeIncident,
    gates: gates.map((gate) => ({ ...gate })),
    transport: transport.map((line) => ({ ...line })),
  };
}
