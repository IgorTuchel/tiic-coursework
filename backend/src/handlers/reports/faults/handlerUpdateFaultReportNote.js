/**
 * @file handlerUpdateFaultReportNote.js
 * @description Handler for updating a note on a fault report. Validates user permissions to ensure they are either the creator of the note, an assigned user of the fault report, or have appropriate roles to update the note. Validates that the fault report is not closed before allowing updates to the note. Responds with the updated note details if the update is successful.
 * @module handlers/reports/faults/handlerUpdateFaultReportNote
 */
import {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from "../../../middleware/errorHandler.js";
import FaultReport from "../../../models/appdb/faultReport.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";
import ReportStatus from "../../../models/appdb/reportStatus.js";
import User from "../../../models/appdb/users.js";
import {
  getReportStatusByID,
  getUserRoleByID,
} from "../../../services/cacheDb.js";
import { userAssignedToFaultReport } from "../../../services/workOnReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import { Sequelize } from "sequelize";

/**
 * Handler for updating a note on a fault report. Validates user permissions to ensure they are either the creator of the note, an assigned user of the fault report, or have appropriate roles to update the note. Validates that the fault report is not closed before allowing updates to the note. Responds with the updated note details if the update is successful.
 *
 * @async
 * @function handlerUpdateFaultReportNote
 * @param {Object} req - The request object containing the fault report ID and note ID in the URL parameters and the updated note details in the request body.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if required fields are missing or if the user does not have permission to update the note.
 * @throws {ForbiddenError} Throws an error if the user does not have permission to update the note.
 * @throws {NotFoundError} Throws an error if the specified fault report, note, or user role is not found.
 */
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
    include: [
      {
        model: ReportStatus,
        as: "reportStatus",
        attributes: ["reportStatusID", "statusName"],
        required: false,
      },
    ],
  });
  if (!faultReport) {
    throw new NotFoundError(req, "Fault report not found");
  }

  if (faultReport.reportStatus.statusName === "closed") {
    throw new BadRequestError(
      req,
      "Cannot update notes on a closed fault report",
    );
  }

  const note = await ReportNotes.findOne({
    where: { reportNoteID: noteID },
    include: [
      {
        model: User,
        as: "createdByUser",
        attributes: ["userID", "firstName", "lastName", "email"],
      },
    ],
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
    data: {
      reportNoteID: updatedNote.reportNoteID,
      title: updatedNote.title,
      content: updatedNote.content,
      createdAt: updatedNote.createdAt,
      updatedAt: updatedNote.updatedAt,
      createdByUser: updatedNote.createdByUser,
    },
  });
}
