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
import User from "../../../models/appdb/users.js";
import ReportStatus from "../../../models/appdb/reportStatus.js";
import SeverityLevel from "../../../models/appdb/severityLevel.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";

export async function handlerUpdateFaultReport(req, res) {
  const { id } = req.params;
  const { name, description, status, severity } = req.body;

  if (!name && !description && !status && !severity) {
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
    !(await userAssignedToFaultReport(req.session.userID, id)) &&
    !requestedUserRole.data.isAdmin &&
    !requestedUserRole.data.canManageFaults
  ) {
    throw new ForbiddenError(
      req,
      "You do not have permission to update this fault report",
    );
  }

  const severityLevel = await getSeverityLevelByID(severity);
  if (!severityLevel.success) {
    throw new BadRequestError(req, "Invalid severity level provided");
  }

  const reportStatus = await getReportStatusByID(status);
  if (!reportStatus.success) {
    throw new BadRequestError(req, "Invalid report status provided");
  }

  faultReport.name = name || faultReport.name;
  faultReport.description = description || faultReport.description;
  faultReport.severityLevelID = severityLevel.data.severityLevelID;
  faultReport.reportStatusID = reportStatus.data.reportStatusID;

  const updatedFaultReport = await faultReport.save();
  if (
    updatedFaultReport instanceof Sequelize.ValidationError ||
    updatedFaultReport instanceof Sequelize.DatabaseError
  ) {
    throw new BadRequestError(req, "Failed to update fault report");
  }

  const faultReportNew = await FaultReport.findOne({
    where: { faultReportID: id },
    include: [
      {
        model: SeverityLevel,
        as: "severityLevel",
        attributes: ["severityLevelID", "severityLevelName"],
        required: false,
      },
      {
        model: ReportStatus,
        as: "reportStatus",
        attributes: ["reportStatusID", "statusName"],
        required: false,
      },
      {
        model: User,
        as: "createdByUser",
        attributes: ["userID", "firstName", "lastName", "email"],
        required: false,
      },
      {
        model: User,
        as: "assignedUsers",
        attributes: ["userID", "firstName", "email"],
        through: { attributes: [] },
        required: false,
      },
      {
        model: ReportNotes,
        as: "notes",
        attributes: [
          "reportNoteID",
          "title",
          "content",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: User,
            as: "createdByUser",
            attributes: ["userID", "firstName", "email"],
          },
        ],
        required: false,
      },
    ],
  });

  if (!faultReportNew) {
    throw new NotFoundError(req, "Fault report not found after update");
  }
  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: faultReportNew,
  });
}
