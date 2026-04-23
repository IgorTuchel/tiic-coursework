import express from "express";
import { handlerCreateMaintenanceReport } from "../handlers/reports/maintenance/handlerCreateMaintenanceReport.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { permissionGuard } from "../middleware/permissionGuard.js";
import { handlerGetAllTools } from "../handlers/reports/tools/handlerGetAllTools.js";
import { handlerGetAllMaintenanceReports } from "../handlers/reports/maintenance/handlerGetAllMaintenanceReports.js";
import {
  handlerAssignUserToMaintenanceReport,
  handlerUnassignUserFromMaintenanceReport,
} from "../handlers/reports/maintenance/handlerAssignMaintenanceReport.js";
import { handlerGetMaintenanceReportByID } from "../handlers/reports/maintenance/handlerGetMaintenanceReportByID.js";
import { handlerCreateMaintenanceReportNote } from "../handlers/reports/maintenance/handlerCreateMaintenanceReportNote.js";
import { handlerUpdateMaintenanceReportNote } from "../handlers/reports/maintenance/handlerUpdateMaintenanceReportNote.js";
import {
  handlerAddToolsToMaintenanceReport,
  handlerRemoveToolsFromMaintenanceReport,
} from "../handlers/reports/tools/handlerManageToolsForMaintenanceReport.js";
import { handlerUpdateMaintenanceReport } from "../handlers/reports/maintenance/handlerUpdateMaintenanceReport.js";
import {
  handlerGetMarkerPdf,
  handlerGetMarkerQr,
} from "../handlers/reports/maintenance/handlerGetMarkerQr.js";
import { handlerGetAssignableUsers } from "../handlers/reports/maintenance/handlerGetAssignableUsers.js";

const router = express.Router();

router.post(
  "/",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerCreateMaintenanceReport,
);

router.get(
  "/",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerGetAllMaintenanceReports,
);

router.get(
  "/assignable-users",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerGetAssignableUsers,
);

router.get(
  "/tools",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerGetAllTools,
);

router.get(
  "/:id",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerGetMaintenanceReportByID,
);

router.put(
  "/:id",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerUpdateMaintenanceReport,
);

router.post(
  "/:id/tools",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerAddToolsToMaintenanceReport,
);

router.delete(
  "/:id/tools",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerRemoveToolsFromMaintenanceReport,
);

router.post(
  "/:id/notes",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerCreateMaintenanceReportNote,
);

router.put(
  "/:id/notes/:noteID",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerUpdateMaintenanceReportNote,
);

router.post(
  "/:id/assign",
  protectedRoute,
  permissionGuard("canAssignReports"),
  handlerAssignUserToMaintenanceReport,
);

router.post(
  "/:id/unassign",
  protectedRoute,
  permissionGuard("canAssignReports"),
  handlerUnassignUserFromMaintenanceReport,
);

router.get(
  "/:id/marker/qr",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerGetMarkerQr,
);

router.get(
  "/:id/marker/pdf",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerGetMarkerPdf,
);

export default router;
