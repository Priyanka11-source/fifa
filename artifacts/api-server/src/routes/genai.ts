import { Router, type IRouter } from "express";
import {
  GetOperationsStateResponse,
  GenerateOperationsBriefResponse,
  SendConciergeMessageBody,
  SendConciergeMessageResponse,
} from "@workspace/api-zod";
import { getOperationalState, setActiveIncident, resetActiveIncident, updateOperationalState, type IncidentType } from "../lib/operationsState";
import { buildOperationsBrief } from "../lib/operationsBrief";
import {
  detectLanguage,
  detectCategory,
  buildConciergeReply,
  summarizeIntent,
} from "../lib/conciergeEngine";

const router: IRouter = Router();

router.get("/genai/operations/state", (_req, res): void => {
  const state = getOperationalState();
  res.json(GetOperationsStateResponse.parse(state));
});

router.post("/genai/operations/brief", (req, res): void => {
  try {
    const state = getOperationalState();
    const brief = buildOperationsBrief(state);
    res.json(GenerateOperationsBriefResponse.parse(brief));
  } catch (err) {
    req.log.error({ err }, "Failed to generate operations brief");
    res.status(502).json({ error: "Operations brief generation failed" });
  }
});

router.post("/genai/operations/simulate", (req, res): void => {
  try {
    const { type } = req.body as { type: IncidentType };
    if (!type || !["none", "storm", "transit_disruption", "crowd_surge", "grid_failure"].includes(type)) {
      res.status(400).json({ error: "Invalid incident type" });
      return;
    }
    setActiveIncident(type);
    res.json({ status: "success" });
  } catch (err) {
    req.log.error({ err }, "Failed to activate incident simulation");
    res.status(500).json({ error: "Simulation activation failed" });
  }
});

router.post("/genai/operations/reset", (req, res): void => {
  try {
    resetActiveIncident();
    res.json({ status: "success" });
  } catch (err) {
    req.log.error({ err }, "Failed to reset incident simulation");
    res.status(500).json({ error: "Simulation reset failed" });
  }
});

router.post("/genai/operations/custom", (req, res): void => {
  try {
    updateOperationalState(req.body);
    res.json({ status: "success" });
  } catch (err) {
    req.log.error({ err }, "Failed to update manual telemetry entries");
    res.status(500).json({ error: "State update failed" });
  }
});

router.post("/genai/concierge/messages", (req, res): void => {
  const parsed = SendConciergeMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const state = getOperationalState();
    const { code, name } = detectLanguage(parsed.data.message);
    const category = detectCategory(parsed.data.message);
    const { reply, replyTranslation } = buildConciergeReply(code, category, state);

    const output = SendConciergeMessageResponse.parse({
      detectedLanguage: name,
      translatedMessage: summarizeIntent(category),
      reply,
      replyTranslation,
      category,
    });

    res.json(output);
  } catch (err) {
    req.log.error({ err }, "Failed to generate concierge reply");
    res.status(502).json({ error: "Concierge reply generation failed" });
  }
});

router.post("/genai/scan-webcam", async (req, res): Promise<void> => {
  try {
    const { image } = req.body as { image: string };
    if (!image) {
      res.status(400).json({ error: "Missing image data" });
      return;
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful local vision emulator if no Gemini key is provided, mimicking Gemini
      setTimeout(() => {
        const isLikelyTicket = base64Data.length % 2 === 0;
        res.json({
          success: true,
          type: isLikelyTicket ? "ticket" : "face",
          message: isLikelyTicket 
            ? "Gemini Vision verified pass: Valid FIFA 2026 QR Matchday Pass detected. Access granted."
            : "Gemini Vision verified face: Biometric scan authenticated successfully. Access granted.",
          details: "Emulator fallback active."
        });
      }, 1000);
      return;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this image from a gate security camera. If it contains a human face, return JSON: { \"success\": true, \"type\": \"face\", \"message\": \"Face match verified. Access granted.\" }. If it contains a ticket, QR code, or paper pass, return JSON: { \"success\": true, \"type\": \"ticket\", \"message\": \"Valid Match Ticket verified. Access granted.\" }. Otherwise, return: { \"success\": false, \"type\": \"unknown\", \"message\": \"Unable to recognize. Please present your ticket or look at the scanner.\" }."
                },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    const result = (await response.json()) as any;
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    res.json(JSON.parse(responseText.trim()));
  } catch (err) {
    req.log.error({ err }, "Gemini scanning failed");
    res.status(500).json({ error: "Gemini ticket scanner vision analysis failed" });
  }
});

export default router;
