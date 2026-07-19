import { describe, it, expect } from "vitest";
import { buildOperationsBrief } from "./operationsBrief";
import type { OperationalStateSnapshot } from "./operationsState";

const baseState: OperationalStateSnapshot = {
  timestamp: new Date().toISOString(),
  weatherCondition: "Clear",
  energyLoadPct: 60,
  crowdCount: 10000,
  activeIncident: "none",
  gates: [
    { id: "gate-1", name: "Gate 1 — North Concourse", crowdPct: 30, status: "clear" },
    { id: "gate-4", name: "Gate 4 — West Plaza", crowdPct: 50, status: "moderate" },
    { id: "gate-6", name: "Gate 6 — Family Entrance", crowdPct: 20, status: "clear" },
    { id: "gate-9", name: "Gate 9 — VIP South", crowdPct: 40, status: "moderate" },
    { id: "gate-12", name: "Gate 12 — Accessible Entrance", crowdPct: 15, status: "clear" },
    { id: "gate-14", name: "Gate 14 — East Concourse", crowdPct: 35, status: "moderate" },
  ],
  transport: [
    { name: "Metro Gold Line", mode: "rail", status: "normal", etaMinutes: 5 },
    { name: "Fan Shuttle Loop A", mode: "shuttle", status: "normal", etaMinutes: 10 },
    { name: "Rideshare Pickup Zone", mode: "rideshare", status: "normal", etaMinutes: 8 },
    { name: "North Parking Structure", mode: "parking", status: "normal", etaMinutes: 0 },
  ],
};

describe("Operations Brief Generator", () => {
  it("should generate nominal operations brief when no active incident", () => {
    const brief = buildOperationsBrief(baseState);
    expect(brief.summary).toContain("on schedule");
    expect(brief.directives.length).toBeGreaterThanOrEqual(1);
    const nominalDirective = brief.directives.find(d => d.category === "security");
    expect(nominalDirective?.title).toContain("nominal");
  });

  it("should generate critical storm directives", () => {
    const stormState: OperationalStateSnapshot = {
      ...baseState,
      activeIncident: "storm",
      weatherCondition: "Severe Thunderstorm",
      energyLoadPct: 88,
    };
    const brief = buildOperationsBrief(stormState);
    expect(brief.summary).toContain("CRITICAL INCIDENT ACTIVE");
    expect(brief.summary).toContain("STORM");
    
    const shelterDirective = brief.directives.find(d => d.title.includes("weather"));
    expect(shelterDirective?.severity).toBe("critical");
    expect(shelterDirective?.category).toBe("security");

    const shuttleDirective = brief.directives.find(d => d.title.includes("shuttle"));
    expect(shuttleDirective?.severity).toBe("watch");
    expect(shuttleDirective?.category).toBe("transport");
  });

  it("should generate critical transit outage directives", () => {
    const transitState: OperationalStateSnapshot = {
      ...baseState,
      activeIncident: "transit_disruption",
    };
    const brief = buildOperationsBrief(transitState);
    expect(brief.summary).toContain("TRANSIT_DISRUPTION");

    const railDirective = brief.directives.find(d => d.title.includes("outage"));
    expect(railDirective?.severity).toBe("critical");
    expect(railDirective?.category).toBe("transport");
  });

  it("should generate critical crowd surge directives", () => {
    const surgeState: OperationalStateSnapshot = {
      ...baseState,
      activeIncident: "crowd_surge",
    };
    const brief = buildOperationsBrief(surgeState);
    expect(brief.summary).toContain("CROWD_SURGE");

    const gateSurge = brief.directives.find(d => d.title.includes("surge"));
    expect(gateSurge?.severity).toBe("critical");
    expect(gateSurge?.category).toBe("crowd");
  });

  it("should generate critical grid failure directives", () => {
    const gridState: OperationalStateSnapshot = {
      ...baseState,
      activeIncident: "grid_failure",
    };
    const brief = buildOperationsBrief(gridState);
    expect(brief.summary).toContain("GRID_FAILURE");

    const genDirective = brief.directives.find(d => d.title.includes("substation"));
    expect(genDirective?.severity).toBe("critical");
    expect(genDirective?.category).toBe("sustainability");
  });
});
