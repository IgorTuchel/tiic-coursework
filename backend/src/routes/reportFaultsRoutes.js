import express from "express";
import { handlerCreateFaultReport } from "../handlers/reports/faults/handlerCreateFaultReport.js";
import { handlerCreateFaultReportNote } from "../handlers/reports/faults/handlerCreateFaultReportNote.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { permissionGuard } from "../middleware/permissionGuard.js";
import { handlerGetFaultReports } from "../handlers/reports/faults/handlerGetFaultReports.js";
import {
  handlerAssignFaultReport,
  handlerUnassignFaultReport,
} from "../handlers/reports/faults/handlerAssignFaultReport.js";

const router = express.Router();

router.post(
  "/",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerCreateFaultReport,
);

router.get(
  "/",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerGetFaultReports,
);

router.post(
  "/:id/notes",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerCreateFaultReportNote,
);

router.post(
  "/:id/assign",
  protectedRoute,
  permissionGuard("canAssignFaults"),
  handlerAssignFaultReport,
);
router.post(
  "/:id/unassign",
  protectedRoute,
  permissionGuard("canAssignFaults"),
  handlerUnassignFaultReport,
);

export default router;
