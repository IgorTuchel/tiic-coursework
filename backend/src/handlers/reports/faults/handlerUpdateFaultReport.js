import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../middleware/errorHandler.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import FaultReport from "../../../models/appdb/faultReport.js";
import { userAssignedToFaultReport } from "../../../services/workOnReport.js";
import {
  getSeverityLevelByID,
  getReportStatusByID,
  getUserRoleByID,
} from "../../../services/cacheDb.js";
import { Sequelize } from "sequelize";

export async function handlerUpdateFaultReport(req, res) {
  const { id } = req.params;
  const { name, description, severityLevelID, reportStatusID } = req.body;

  if (!name && !description && !severityLevelID && !reportStatusID) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const faultReport = await FaultReport.findOne({
    where: { faultReportID: id },
  });

  if (!faultReport) {
    throw new NotFoundError(req, "Fault report not found");
  }

  const requestedUserRole = await getUserRoleByID(req.session.roleID);
  if (!requestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  if (
    faultReport.createdBy !== req.session.userID &&
    !userAssignedToFaultReport(req.session.userID, id) &&
    !requestedUserRole.data.isAdmin &&
    !requestedUserRole.data.canManageFaults
  ) {
    console.log(requestedUserRole.data);
    throw new ForbiddenError(
      req,
      "You do not have permission to update this fault report",
    );
  }

  if (severityLevelID) {
    const severityLevel = await getSeverityLevelByID(severityLevelID);
    if (!severityLevel.success) {
      throw new BadRequestError(req, "Invalid severity level provided");
    }
  }

  if (reportStatusID) {
    const reportStatus = await getReportStatusByID(reportStatusID);
    if (!reportStatus.success) {
      throw new BadRequestError(req, "Invalid report status provided");
    }
  }

  faultReport.name = name || faultReport.name;
  faultReport.description = description || faultReport.description;
  faultReport.severityLevel = severityLevelID || faultReport.severityLevel;
  faultReport.reportStatus = reportStatusID || faultReport.reportStatus;

  const updatedFaultReport = await faultReport.save();

  if (updatedFaultReport instanceof Sequelize.ValidationError) {
    throw new BadRequestError(req, "Failed to update fault report");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: updatedFaultReport,
  });
}
