import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { handlerGetSeverityLevels } from "../handlers/reports/severity/handlerGetSeverityLevels.js";

const router = express.Router();

router.get("/", protectedRoute, handlerGetSeverityLevels);

export default router;
