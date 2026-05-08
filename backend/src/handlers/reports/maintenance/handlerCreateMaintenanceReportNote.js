/**
 * @file handlerCreateMaintenanceReportNote.js
 * @description Handler for creating a note on a maintenance report. Validates user permissions to ensure they are either the creator, an assigned user, or have appropriate roles to add notes to the maintenance report. Validates the existence of the maintenance report before allowing note creation. Responds with the details of the created note if successful.
 * @module handlers/reports/maintenance/handlerCreateMaintenanceReportNote
 */
import {
  BadRequestError,
  InternalServerError,
} from "../../../middleware/errorHandler.js";
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";
import MaintenanceReportNotes from "../../../models/appdb/maintenanceReportNotes.js";
import { NotFoundError } from "../../../middleware/errorHandler.js";
import {
  getUserByID,
  getUserRoleByID,
  getUserStatusByID,
} from "../../../services/cacheDb.js";
import { userAssignedToMaintenanceReport } from "../../../services/workOnReport.js";

/**
 * Handler for adding a note to an existing maintenance report. Validates the input data, checks user permissions, and creates a new note linked to the specified maintenance report in the database. Responds with the details of the newly created note upon success.
 *
 * @async
 * @function handlerCreateMaintenanceReportNote
 * @param {Object} req - The request object containing the maintenance report ID in the URL parameters and the note details in the request body.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if required fields are missing or if the user does not have permission to add notes to the maintenance report.
 * @throws {InternalServerError} Throws an error if there is a failure in creating the note or linking it to the maintenance report.
 * @throws {NotFoundError} Throws an error if the specified maintenance report or user role is not found.
 */
export async function handlerCreateMaintenanceReportNote(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const maintenanceReport = await MaintenanceReport.findOne({
    where: { maintenanceReportID: id },
  });
  if (!maintenanceReport) {
    throw new NotFoundError(req, "Maintenance report not found");
  }
  const requestedUserRole = await getUserRoleByID(req.session.roleID);
  if (!requestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  if (
    maintenanceReport.createdBy !== req.session.userID &&
    !requestedUserRole.data.isAdmin &&
    !requestedUserRole.data.canManageReports &&
    !(await userAssignedToMaintenanceReport(req.session.userID, id))
  ) {
    throw new BadRequestError(
      req,
      "You do not have permission to add notes to this maintenance report",
    );
  }

  const newNote = await ReportNotes.create({
    title,
    content,
    createdBy: req.session.userID,
  });

  if (!newNote) {
    throw new InternalServerError(
      req,
      "Failed to add note to maintenance report",
    );
  }

  const maintenanceReportNotes = await MaintenanceReportNotes.create({
    maintenanceReportID: id,
    reportNoteID: newNote.reportNoteID,
  });

  if (!maintenanceReportNotes) {
    await newNote.destroy();
    throw new InternalServerError(
      req,
      "Failed to link note to maintenance report",
    );
  }
  const getUser = await getUserByID(req.session.userID);
  if (!getUser.success) {
    throw new NotFoundError(req, "User not found");
  }
  respondWithJson(res, HTTPCodes.CREATED, {
    data: {
      reportNoteID: newNote.reportNoteID,
      title: newNote.title,
      content: newNote.content,
      createdByUser: {
        userID: getUser.data.userID,
        email: getUser.data.email,
        firstName: getUser.data.firstName,
        lastName: getUser.data.lastName,
      },
      createdAt: newNote.createdAt,
      updatedAt: newNote.updatedAt,
    },
  });
}
