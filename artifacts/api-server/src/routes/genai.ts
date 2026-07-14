import { Router, type IRouter } from "express";
import {
  GetOperationsStateResponse,
  GenerateOperationsBriefResponse,
  SendConciergeMessageBody,
  SendConciergeMessageResponse,
} from "@workspace/api-zod";
import { getOperationalState } from "../lib/operationsState";
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

export default router;
