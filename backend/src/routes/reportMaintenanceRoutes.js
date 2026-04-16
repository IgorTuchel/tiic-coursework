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
  "/tools",
  protectedRoute,
  permissionGuard("canWorkOnReports"),
  handlerGetAllTools,
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

export default router;
