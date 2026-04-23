import express from "express";
import { handlerCreateFaultReport } from "../handlers/reports/faults/handlerCreateFaultReport.js";
import { handlerCreateFaultReportNote } from "../handlers/reports/faults/handlerCreateFaultReportNote.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { permissionGuard } from "../middleware/permissionGuard.js";
import {
  handlerGetFaultReportByID,
  handlerGetFaultReports,
} from "../handlers/reports/faults/handlerGetFaultReports.js";
import {
  handlerAssignFaultReport,
  handlerUnassignFaultReport,
} from "../handlers/reports/faults/handlerAssignFaultReport.js";
import { handlerUpdateFaultReport } from "../handlers/reports/faults/handlerUpdateFaultReport.js";
import { handlerUpdateFaultReportNote } from "../handlers/reports/faults/handlerUpdateFaultReportNote.js";
import { handlerGetAssignableUsers } from "../handlers/reports/faults/handlerGetAssignableUsers.js";

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

router.get(
  "/assignable-users",
  protectedRoute,
  permissionGuard("canAssignFaults"),
  handlerGetAssignableUsers,
);

router.get(
  "/:id",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerGetFaultReportByID,
);

router.put(
  "/:id",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerUpdateFaultReport,
);

router.post(
  "/:id/notes",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerCreateFaultReportNote,
);

router.post(
  "/:id/notes/:noteID",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerUpdateFaultReportNote,
);

router.put(
  "/:id/notes/:noteID",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerUpdateFaultReportNote,
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
