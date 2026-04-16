import {
  BadRequestError,
  InternalServerError,
} from "../../../middleware/errorHandler.js";
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";
import MaintenanceReportNotes from "../../../models/appdb/maintenanceReportNotes.js";
import { NotFoundError } from "../../../middleware/errorHandler.js";
import { getUserRoleByID } from "../../../services/cacheDb.js";
import { userAssignedToMaintenanceReport } from "../../../services/workOnReport.js";

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

  respondWithJson(res, HTTPCodes.CREATED, {
    data: {
      reportNoteID: newNote.reportNoteID,
      title: newNote.title,
      content: newNote.content,
      createdBy: req.session.userID,
    },
  });
}
