import { Router } from "express";
import { handlerGetPrompt } from "./prompt";

const router = Router();

router.get("/prompt", handlerGetPrompt);

export default router;
