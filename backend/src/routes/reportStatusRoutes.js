import express from "express";
import { handlerGetReportStatuses } from "../handlers/reports/status/handlerGetReportStatus.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/", protectedRoute, handlerGetReportStatuses);

export default router;
