import { describe, it, expect } from "vitest";
import { detectLanguage, detectCategory, buildConciergeReply, summarizeIntent } from "./conciergeEngine";
import type { OperationalStateSnapshot } from "./operationsState";

const mockState: OperationalStateSnapshot = {
  timestamp: new Date().toISOString(),
  weatherCondition: "Clear",
  energyLoadPct: 60,
  crowdCount: 15000,
  activeIncident: "none",
  gates: [
    { id: "gate-1", name: "Gate 1 — North Concourse", crowdPct: 30, status: "clear" },
    { id: "gate-4", name: "Gate 4 — West Plaza", crowdPct: 80, status: "congested" },
    { id: "gate-12", name: "Gate 12 — Accessible Entrance", crowdPct: 15, status: "clear" },
  ],
  transport: [
    { name: "Metro Gold Line", mode: "rail", status: "normal", etaMinutes: 5 },
    { name: "Fan Shuttle Loop A", mode: "shuttle", status: "normal", etaMinutes: 10 },
  ],
};

describe("Concierge Language Detection", () => {
  it("should detect Japanese characters", () => {
    const result = detectLanguage("こんにちは、ゲートはどこですか？");
    expect(result.code).toBe("ja");
    expect(result.name).toBe("Japanese");
  });

  it("should detect Arabic characters", () => {
    const result = detectLanguage("أين يمكنني العثور على التذكرة؟");
    expect(result.code).toBe("ar");
    expect(result.name).toBe("Arabic");
  });

  it("should heuristically detect Spanish", () => {
    const result = detectLanguage("¿Dónde está mi puerta?");
    expect(result.code).toBe("es");
  });

  it("should heuristically detect French", () => {
    const result = detectLanguage("Où est mon billet s'il vous plaît?");
    expect(result.code).toBe("fr");
  });

  it("should heuristically detect Portuguese", () => {
    const result = detectLanguage("onde fica o portão por favor?");
    expect(result.code).toBe("pt");
  });

  it("should default to English for general queries", () => {
    const result = detectLanguage("hello how are you");
    expect(result.code).toBe("en");
  });
});

describe("Concierge Intent/Category Detection", () => {
  it("should classify navigation intent", () => {
    expect(detectCategory("Where is the gate?")).toBe("navigation");
    expect(detectCategory("How do I find my seat?")).toBe("navigation");
  });

  it("should classify accessibility intent", () => {
    expect(detectCategory("Is there wheelchair access?")).toBe("accessibility");
    expect(detectCategory("wheelchair ramp entrance")).toBe("accessibility");
  });

  it("should classify transportation intent", () => {
    expect(detectCategory("When is the next shuttle?")).toBe("transportation");
    expect(detectCategory("Where is metro gold line parking?")).toBe("transportation");
  });

  it("should classify ticketing intent", () => {
    expect(detectCategory("I lost my ticket QR code")).toBe("ticketing");
    expect(detectCategory("how can I get a refund?")).toBe("ticketing");
  });

  it("should default to general intent", () => {
    expect(detectCategory("Hello there")).toBe("general");
  });
});

describe("Concierge Reply Generation & Summarization", () => {
  it("should generate proper english reply for navigation", () => {
    const { reply, replyTranslation } = buildConciergeReply("en", "navigation", mockState);
    expect(reply).toContain("Gate 1"); // quietest gate in mock state
    expect(replyTranslation).toBe(reply);
  });

  it("should generate translated reply for Spanish navigation", () => {
    const { reply, replyTranslation } = buildConciergeReply("es", "navigation", mockState);
    expect(reply).toContain("Gate 1");
    expect(replyTranslation).not.toBe(reply);
    expect(replyTranslation).toContain("shortest wait");
  });

  it("should summarize categories accurately", () => {
    expect(summarizeIntent("navigation")).toContain("directions to a gate");
    expect(summarizeIntent("accessibility")).toContain("wheelchair access");
  });
});
