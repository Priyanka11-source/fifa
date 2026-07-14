import { Router, type IRouter } from "express";
import healthRouter from "./health";
import genaiRouter from "./genai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(genaiRouter);

export default router;
