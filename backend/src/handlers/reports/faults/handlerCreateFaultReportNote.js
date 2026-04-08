import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../../utils/errors.js";
import { respondWithJson, HTTPCodes } from "../../utils/json.js";
import FaultReport from "../../models/appdb/faultReport.js";
import ReportNotes from "../../models/appdb/reportNotes.js";
import FaultReportNotes from "../../models/appdb/faultReportNotes.js";

export async function handlerCreateFaultReportNote(req, res) {
  const { faultReportID } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const faultReport = await FaultReport.findOne({
    where: { faultReportID },
  });
  if (!faultReport) {
    throw new NotFoundError(req, "Fault report not found");
  }

  const requestedUserRole = await Roles.findOne({
    where: { roleID: req.session.roleID },
  });

  if (!requestedUserRole) {
    throw new NotFoundError(req, "User role not found");
  }

  if (faultReport.createdBy !== req.session.userID || !requestedUserRole.isAdmin || !requestedUserRole.canMangeFaults) {

  const newNote = await ReportNotes.create({
    title,
    content,
    createdBy: req.session.userID,
  });

  if (!newNote) {
    throw new InternalServerError(req, "Failed to add note to fault report");
  }

  const faultReportNotes = await FaultReportNotes.create({
    faultReportID,
    reportNoteID: newNote.reportNoteID,
  });

  if (!faultReportNotes) {
    await newNote.destroy();
    throw new InternalServerError(req, "Failed to link note to fault report");
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
