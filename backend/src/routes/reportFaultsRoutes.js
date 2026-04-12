import express from "express";
import { handlerCreateFaultReport } from "../handlers/reports/faults/handlerCreateFaultReport.js";
import { handlerCreateFaultReportNote } from "../handlers/reports/faults/handlerCreateFaultReportNote.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { permissionGuard } from "../middleware/permissionGuard.js";

const router = express.Router();

router.post(
  "/",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerCreateFaultReport,
);

router.post(
  "/:id/notes",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerCreateFaultReportNote,
);

export default router;
