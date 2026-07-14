import { Router, type IRouter } from "express";
import {
  GetOperationsStateResponse,
  GenerateOperationsBriefResponse,
  SendConciergeMessageBody,
  SendConciergeMessageResponse,
} from "@workspace/api-zod";
import { openai, GENAI_TEXT_MODEL } from "../lib/openaiClient";
import { getOperationalState } from "../lib/operationsState";

const router: IRouter = Router();

router.get("/genai/operations/state", (_req, res): void => {
  const state = getOperationalState();
  res.json(GetOperationsStateResponse.parse(state));
});

router.post("/genai/operations/brief", async (req, res): Promise<void> => {
  const state = getOperationalState();

  const prompt = `You are the GenAI operational intelligence system for a FIFA World Cup 2026 host stadium. Given the live telemetry snapshot below, produce a JSON object with:
- "summary": one crisp sentence (max 220 chars) giving the overall operational picture right now.
- "directives": an array of 3 to 5 objects, each with:
  - "id": a short slug-like string unique within this response
  - "title": a short imperative title (max 60 chars)
  - "detail": one specific, realistic sentence describing the situation and the GenAI action being taken or recommended (max 200 chars). Reference real gate names, transport lines, or metrics from the data when relevant.
  - "category": one of "crowd", "accessibility", "transport", "sustainability", "security", "ticketing"
  - "severity": one of "info", "watch", "critical" based on how urgent the underlying data point is
  - "gate": the relevant gate id string from the data if applicable, otherwise null
  - "status": one of "executing", "monitoring", "resolved"

Cover a spread of categories, not just crowd. Prioritize the most congested gates, delayed/disrupted transport lines, and the current energy load. Respond with ONLY the JSON object, no markdown.

Live telemetry snapshot:
${JSON.stringify(state)}`;

  try {
    const completion = await openai.chat.completions.create({
      model: GENAI_TEXT_MODEL,
      max_completion_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("Empty response from model");
    }

    const parsedJson: unknown = JSON.parse(raw);
    const brief = GenerateOperationsBriefResponse.parse({
      generatedAt: new Date().toISOString(),
      ...(parsedJson as Record<string, unknown>),
    });

    res.json(brief);
  } catch (err) {
    req.log.error({ err }, "Failed to generate operations brief");
    res.status(502).json({ error: "GenAI operations brief generation failed" });
  }
});

router.post("/genai/concierge/messages", async (req, res): Promise<void> => {
  const parsed = SendConciergeMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const state = getOperationalState();

  const prompt = `You are "Concierge", a warm and highly capable multilingual GenAI assistant for fans at a FIFA World Cup 2026 stadium. A fan just sent you a message in whatever language they are comfortable with.

Current live stadium context you may reference in your reply (gate congestion, transport, weather):
${JSON.stringify(state)}

Fan message: """${parsed.data.message}"""

Respond with ONLY a JSON object with these fields:
- "detectedLanguage": the language name of the fan's message (e.g. "Spanish", "English", "Japanese")
- "translatedMessage": the fan's message translated into English
- "category": one of "navigation", "accessibility", "transportation", "ticketing", "general" — classify the fan's intent
- "reply": your helpful, concise (max 240 chars), specific reply written in the SAME language the fan wrote in (detectedLanguage). Use the live stadium context above when relevant (real gate names, wait implications, transport ETAs).
- "replyTranslation": the English translation of your "reply" field

Be specific and grounded in the provided stadium data rather than generic. Respond with ONLY the JSON object, no markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: GENAI_TEXT_MODEL,
      max_completion_tokens: 600,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("Empty response from model");
    }

    const parsedJson: unknown = JSON.parse(raw);
    const output = SendConciergeMessageResponse.parse(parsedJson);

    res.json(output);
  } catch (err) {
    req.log.error({ err }, "Failed to generate concierge reply");
    res.status(502).json({ error: "GenAI concierge reply generation failed" });
  }
});

export default router;
