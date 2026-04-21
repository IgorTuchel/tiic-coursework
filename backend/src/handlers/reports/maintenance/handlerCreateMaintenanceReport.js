import {
  BadRequestError,
  InternalServerError,
} from "../../../middleware/errorHandler.js";
import { getReportStatuses, getToolByID } from "../../../services/cacheDb.js";
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import { getSeverityLevelByID } from "../../../services/cacheDb.js";
import MaintenanceReportToolCheck from "../../../models/appdb/maintenanceReportToolCheck.js";

export async function handlerCreateMaintenanceReport(req, res) {
  const { name, description, severity, markerScanBlob, tools } = req.body;

  if (!name || !description || !severity || !tools) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const reportStatus = await getReportStatuses()
    .then((res) => {
      if (!res.success) {
        throw new InternalServerError(
          req,
          "Failed to retrieve report statuses",
        );
      }
      return res.data.find((status) => status.statusName === "open");
    })
    .catch((err) => {
      throw new InternalServerError(req, "Failed to retrieve report statuses");
    });

  const severityLevel = await getSeverityLevelByID(severity);
  if (!severityLevel.success) {
    throw new BadRequestError(req, "Invalid severity level provided");
  }

  const newMaintenanceReport = await MaintenanceReport.create({
    name,
    description,
    reportStatusID: reportStatus.reportStatusID,
    severityLevelID: severity,
    markerScanBlob,
    createdBy: req.session.userID,
  });

  if (!newMaintenanceReport) {
    throw new InternalServerError(req, "Failed to create maintenance report");
  }

  const assignedTools = [];
  for (const toolID of tools) {
    const existingTool = await getToolByID(toolID);
    if (!existingTool.success) {
      throw new BadRequestError(req, `Tool with ID ${toolID} not found`);
    }
    const tool = await MaintenanceReportToolCheck.create({
      maintenanceReportID: newMaintenanceReport.maintenanceReportID,
      toolID,
    });
    if (!tool) {
      await newMaintenanceReport.destroy();
      throw new InternalServerError(
        req,
        "Failed to associate tool with maintenance report",
      );
    }
    assignedTools.push(existingTool.data.name);
  }

  respondWithJson(res, HTTPCodes.CREATED, {
    data: {
      maintenanceReportID: newMaintenanceReport.maintenanceReportID,
      name: newMaintenanceReport.name,
      description: newMaintenanceReport.description,
      reportStatus: reportStatus.statusName,
      severityLevel: severity,
      markerScanBlob: newMaintenanceReport.markerScanBlob,
      createdBy: req.session.userID,
      tools: assignedTools,
    },
  });
}
