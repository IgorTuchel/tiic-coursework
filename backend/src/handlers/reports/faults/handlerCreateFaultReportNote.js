/**
 * @file handlerCreateFaultReportNote.js
 * @description Handler for adding notes to existing fault reports. Validates the input data, checks user permissions, and creates a new note linked to the specified fault report in the database. Responds with the details of the newly created note upon success.
 * @module handlers/reports/faults/handlerCreateFaultReportNote
 */
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../../../middleware/errorHandler.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import FaultReport from "../../../models/appdb/faultReport.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";
import FaultReportNotes from "../../../models/appdb/faultReportNotes.js";
import { userAssignedToFaultReport } from "../../../services/workOnReport.js";
import { getUserByID, getUserRoleByID } from "../../../services/cacheDb.js";

/**
 * Handler for adding a note to an existing fault report. Validates the input data, checks user permissions, and creates a new note linked to the specified fault report in the database. Responds with the details of the newly created note upon success.
 *
 * @async
 * @function handlerCreateFaultReportNote
 * @param {Object} req - The request object containing the fault report ID in the URL parameters and the note details in the request body.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if required fields are missing or if the user does not have permission to add notes to the fault report.
 * @throws {InternalServerError} Throws an error if there is a failure in creating the note or linking it to the fault report.
 * @throws {NotFoundError} Throws an error if the specified fault report or user role is not found.
 */
export async function handlerCreateFaultReportNote(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
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
        !requestedUserRole.data.isAdmin &&
        !requestedUserRole.data.canManageFaults &&
        !(await userAssignedToFaultReport(req.session.userID, id))
    ) {
        throw new BadRequestError(
            req,
            "You do not have permission to add notes to this fault report",
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
            "Failed to add note to fault report",
        );
    }

    const faultReportNotes = await FaultReportNotes.create({
        faultReportID: id,
        reportNoteID: newNote.reportNoteID,
    });

    if (!faultReportNotes) {
        await newNote.destroy();
        throw new InternalServerError(
            req,
            "Failed to link note to fault report",
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
                userID: req.session.userID,
                firstName: getUser.data.firstName,
                lastName: getUser.data.lastName,
                email: getUser.data.email,
            },
            createdAt: newNote.createdAt,
            updatedAt: newNote.updatedAt,
        },
    });
}
