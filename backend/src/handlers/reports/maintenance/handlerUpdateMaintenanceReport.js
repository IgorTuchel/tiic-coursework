import { Sequelize } from "sequelize";
import { BadRequestError } from "../../../middleware/errorHandler.js";
import { getSeverityLevelByID } from "../../../services/cacheDb.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import { getReportStatusByID } from "../../../services/cacheDb.js";
import { getUserRoleByID } from "../../../services/cacheDb.js";
import { userAssignedToMaintenanceReport } from "../../../services/workOnReport.js";
import {
  NotFoundError,
  ForbiddenError,
} from "../../../middleware/errorHandler.js";

export async function handlerUpdateMaintenanceReport(req, res) {
  const { id } = req.params;
  const { name, description, status, severity, markerScanBlob } = req.body;

  if (!name && !description && !status && !severity && !markerScanBlob) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const requestedUserRole = await getUserRoleByID(req.session.roleID);
  if (!requestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  const maintenanceReport = await MaintenanceReport.findOne({
    where: { maintenanceReportID: id },
  });

  if (!maintenanceReport) {
    throw new NotFoundError(req, "Maintenance report not found");
  }

  if (
    maintenanceReport.createdBy !== req.session.userID &&
    !(await userAssignedToMaintenanceReport(req.session.userID, id)) &&
    !requestedUserRole.data.isAdmin &&
    !requestedUserRole.data.canManageReports
  ) {
    throw new ForbiddenError(
      req,
      "You do not have permission to update this maintenance report",
    );
  }

  if (status) {
    const reportStatus = await getReportStatusByID(status);
    if (!reportStatus.success) {
      throw new BadRequestError(req, "Invalid report status provided");
    }
  }

  if (severity) {
    const severityLevel = await getSeverityLevelByID(severity);
    if (!severityLevel.success) {
      throw new BadRequestError(req, "Invalid severity level provided");
    }
  }

  maintenanceReport.name = name || maintenanceReport.name;
  maintenanceReport.description = description || maintenanceReport.description;
  maintenanceReport.reportStatusID = status || maintenanceReport.reportStatusID;
  maintenanceReport.severityLevelID =
    severity || maintenanceReport.severityLevelID;
  maintenanceReport.markerScanBlob =
    markerScanBlob || maintenanceReport.markerScanBlob;

  const saved = await maintenanceReport.save();
  if (saved instanceof Sequelize.ValidationError) {
    throw new BadRequestError(req, "Failed to update maintenance report");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: {
      maintenanceReportID: saved.maintenanceReportID,
      name: saved.name,
      description: saved.description,
      reportStatusID: saved.reportStatusID,
      severityLevelID: saved.severityLevelID,
      markerScanBlob: saved.markerScanBlob,
    },
  });
}
