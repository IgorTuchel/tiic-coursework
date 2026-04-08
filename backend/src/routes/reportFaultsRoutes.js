import express from "express";
import { handlerCreateFaultReport } from "../handlers/reports/faults/handlerCreateFaultReport";
import { handlerCreateFaultReportNote } from "../handlers/reports/faults/handlerCreateFaultReportNote";
import { protectedRoute } from "../middleware/protectedRoute";
import { permissionGuard } from "../middleware/permissionGuard";

const router = express.Router();

router.post(
  "/",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerCreateFaultReport,
);

router.post(
  "/:id",
  protectedRoute,
  permissionGuard("canSuggestFaults"),
  handlerCreateFaultReportNote,
);
