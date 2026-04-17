import {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from "../../../middleware/errorHandler.js";
import FaultReport from "../../../models/appdb/faultReport.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";
import {
  getReportStatusByID,
  getUserRoleByID,
} from "../../../services/cacheDb.js";
import { userAssignedToFaultReport } from "../../../services/workOnReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import { Sequelize } from "sequelize";

export async function handlerUpdateFaultReportNote(req, res) {
  const { id, noteID } = req.params;
  const { title, content } = req.body;

  if (!title && !content) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const requestedUserRole = await getUserRoleByID(req.session.roleID);
  if (!requestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  const faultReport = await FaultReport.findOne({
    where: { faultReportID: id },
  });
  if (!faultReport) {
    throw new NotFoundError(req, "Fault report not found");
  }

  const reportStatus = await getReportStatusByID(faultReport.reportStatus);
  if (!reportStatus.success) {
    throw new NotFoundError(req, "Report status not found");
  }

  if (reportStatus.data.statusName === "Closed") {
    throw new BadRequestError(
      req,
      "Cannot update notes on a closed fault report",
    );
  }

  const note = await ReportNotes.findOne({
    where: { reportNoteID: noteID },
  });
  if (!note) {
    throw new NotFoundError(req, "Report note not found");
  }

  if (
    note.createdBy !== req.session.userID &&
    !requestedUserRole.data.isAdmin &&
    !requestedUserRole.data.canManageFaults &&
    !(await userAssignedToFaultReport(req.session.userID, id))
  ) {
    throw new ForbiddenError(
      req,
      "You do not have permission to update this note",
    );
  }

  note.title = title || note.title;
  note.content = content || note.content;

  const updatedNote = await note.save();
  if (updatedNote instanceof Sequelize.ValidationError) {
    throw new BadRequestError(req, "Failed to update report note");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: updatedNote,
  });
}
