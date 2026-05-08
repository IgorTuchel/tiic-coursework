/**
 * @file handlerGetMaintenanceReportByID.js
 * @description Handler for retrieving a maintenance report by its ID. Validates user permissions to ensure they have the appropriate roles to view the report. Responds with the requested maintenance report data if successful.
 * @module handlers/reports/maintenance/handlerGetMaintenanceReportByID
 */
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import User from "../../../models/appdb/users.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";
import {
  NotFoundError,
  BadRequestError,
} from "../../../middleware/errorHandler.js";
import { getUserRoleByID } from "../../../services/cacheDb.js";
import { userAssignedToMaintenanceReport } from "../../../services/workOnReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import ToolCheck from "../../../models/appdb/toolCheck.js";
import SeverityLevel from "../../../models/appdb/severityLevel.js";
import ReportStatus from "../../../models/appdb/reportStatus.js";

/**
 * Handler for retrieving a maintenance report by its ID. Validates user permissions to ensure they have the appropriate roles to view the report. Responds with the requested maintenance report data if successful.
 *
 * @async
 * @function handlerGetMaintenanceReportByID
 * @param {Object} req - The request object containing the maintenance report ID in the URL parameters.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if the user does not have permission to view the maintenance report.
 * @throws {NotFoundError} Throws an error if the user's role is not found or if the maintenance report is not found.
 * @returns {Object} The maintenance report data if the operation is successful.
 */
export async function handlerGetMaintenanceReportByID(req, res) {
  const { id } = req.params;
  const requestedUserRole = await getUserRoleByID(req.session.roleID);

  if (!requestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  if (
    !userAssignedToMaintenanceReport(req.session.userID, id) &&
    !requestedUserRole.data.isAdmin &&
    !requestedUserRole.data.canManageReports &&
    !requestedUserRole.data.canViewAllReports
  ) {
    throw new BadRequestError(
      req,
      "You do not have permission to view this maintenance report",
    );
  }
  const maintenanceReport = await MaintenanceReport.findOne({
    where: { maintenanceReportID: id },
    include: [
      {
        model: User,
        as: "assignedUsers",
        attributes: ["userID", "firstName", "lastName", "email"],
        through: { attributes: [] },
        required: false,
      },
      {
        model: User,
        as: "createdByUser",
        attributes: ["userID", "firstName", "lastName", "email"],
        required: false,
      },
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
        model: ReportNotes,
        as: "notes",
        through: { attributes: [] },
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
            attributes: ["userID", "firstName", "lastName", "email"],
          },
        ],
        required: false,
      },
      {
        model: ToolCheck,
        as: "toolChecks",
        attributes: ["toolID", "name"],
        through: { attributes: [] },
        required: false,
      },
    ],
  });

  if (!maintenanceReport) {
    throw new NotFoundError(req, "Maintenance report not found");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: maintenanceReport,
  });
}
