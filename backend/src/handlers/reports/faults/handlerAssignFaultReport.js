/**
 * @file handlerAssignFaultReport.js
 * @description Handler for assigning and unassigning users to fault reports. Provides endpoints to assign a user to a specific fault report and to unassign a user from a fault report. Validates the existence of the user and the fault report before performing the assignment or unassignment operation.
 * @module handlers/reports/faults/handlerAssignFaultReport
 */
import { BadRequestError } from "../../../middleware/errorHandler.js";
import FaultReport from "../../../models/appdb/faultReport.js";
import { getUserByID } from "../../../services/cacheDb.js";
import {
  assignUserToFaultReport,
  unassignUserFromFaultReport,
} from "../../../services/workOnReport.js";
import { HTTPCodes, respondWithJson } from "../../../utils/json.js";

/**
 * Handler for assigning a user to a fault report. Validates the existence of the user and the fault report before performing the assignment operation.
 *
 * @async
 * @function handlerAssignFaultReport
 * @param {Object} req - The request object containing the fault report ID in the URL parameters and the user ID in the request body.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if the user or fault report is not found, or if the assignment operation fails.
 */
export async function handlerAssignFaultReport(req, res) {
  const { id } = req.params;
  const { userID } = req.body;

  const user = await getUserByID(userID);
  if (!user.success) {
    throw new BadRequestError(req, "User not found");
  }

  const faultReport = await FaultReport.findOne({
    where: { faultReportID: id },
  });
  if (!faultReport) {
    throw new BadRequestError(req, "Fault report not found");
  }

  const assigned = await assignUserToFaultReport(userID, id);
  if (!assigned.success) {
    throw new BadRequestError(req, assigned.message);
  }

  respondWithJson(res, HTTPCodes.CREATED, {
    success: true,
    message: "User assigned to fault report successfully",
  });
}

/**
 * Handler for unassigning a user from a fault report. Validates the existence of the user and the fault report before performing the unassignment operation.
 *
 * @async
 * @function handlerUnassignFaultReport
 * @param {Object} req - The request object containing the fault report ID in the URL parameters and the user ID in the request body.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if the user or fault report is not found, or if the unassignment operation fails.
 */
export async function handlerUnassignFaultReport(req, res) {
  const { id } = req.params;
  const { userID } = req.body;

  const user = await getUserByID(userID);
  if (!user.success) {
    throw new BadRequestError(req, "User not found");
  }

  const faultReport = await FaultReport.findOne({
    where: { faultReportID: id },
  });
  if (!faultReport) {
    throw new BadRequestError(req, "Fault report not found");
  }

  const unassign = await unassignUserFromFaultReport(userID, id);
  if (!unassign.success) {
    throw new BadRequestError(req, unassign.message);
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "User unassigned from fault report successfully",
  });
}
