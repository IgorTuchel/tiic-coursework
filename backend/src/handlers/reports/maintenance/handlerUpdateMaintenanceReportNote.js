import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";
import {
  NotFoundError,
  BadRequestError,
} from "../../../middleware/errorHandler.js";
import { getUserRoleByID } from "../../../services/cacheDb.js";
import { userAssignedToMaintenanceReport } from "../../../services/workOnReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import { Sequelize } from "sequelize";

export async function handlerUpdateMaintenanceReportNote(req, res) {
  const { id, noteID } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
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
    !requestedUserRole.data.isAdmin &&
    !requestedUserRole.data.canManageReports &&
    !(await userAssignedToMaintenanceReport(req.session.userID, id))
  ) {
    throw new BadRequestError(
      req,
      "You do not have permission to update this maintenance report",
    );
  }
  const note = await ReportNotes.findOne({
    where: { reportNoteID: noteID },
  });
  if (!note) {
    throw new NotFoundError(req, "Report note not found");
  }

  note.title = title || note.title;
  note.content = content || note.content;

  const updatedNote = await note.save();
  if (updatedNote instanceof Sequelize.ValidationError || !updatedNote) {
    throw new BadRequestError(req, "Failed to update report note");
  }

  respondWithJson(res, HTTPCodes.OK, {
    data: {
      reportNoteID: updatedNote.reportNoteID,
      title: updatedNote.title,
      content: updatedNote.content,
      createdBy: updatedNote.createdBy,
    },
  });
}
