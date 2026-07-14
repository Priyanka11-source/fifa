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
  gates: GateState[];
  transport: TransportLineState[];
}

const WEATHER_CONDITIONS = ["Clear", "Overcast", "Light Rain", "Humid", "Windy"];

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
    gates: gates.map((gate) => ({ ...gate })),
    transport: transport.map((line) => ({ ...line })),
  };
}
