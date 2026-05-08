/**
 * @file handlerAssignMaintenanceReport.js
 * @description Handlers for assigning and unassigning users to maintenance reports. Validates user permissions to ensure they have the appropriate roles to perform these actions. Validates the existence of the maintenance report before attempting to assign or unassign users. Responds with success messages if the operations are successful.
 * @module handlers/reports/maintenance/handlerAssignMaintenanceReport
 */
import { BadRequestError } from "../../../middleware/errorHandler.js";
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import { assignUserToMaintenanceReport } from "../../../services/workOnReport.js";
import { NotFoundError } from "../../../middleware/errorHandler.js";
import { unassignUserFromMaintenanceReport } from "../../../services/workOnReport.js";

/**
 * Handler for assigning a user to a maintenance report. Validates the existence of the user and the maintenance report before performing the assignment operation.
 *
 * @async
 * @function handlerAssignUserToMaintenanceReport
 * @param {Object} req - The request object containing the maintenance report ID in the URL parameters and the user ID in the request body.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if the user or maintenance report is not found, or if the assignment operation fails.
 */
export async function handlerAssignUserToMaintenanceReport(req, res) {
  const { id } = req.params;
  const { userID } = req.body;

  if (!userID) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const maintenanceReport = await MaintenanceReport.findOne({
    where: { maintenanceReportID: id },
  });
  if (!maintenanceReport) {
    throw new NotFoundError(req, "Maintenance report not found");
  }

  const assigned = await assignUserToMaintenanceReport(userID, id);
  if (!assigned.success) {
    throw new BadRequestError(
      req,
      assigned.message || "Failed to assign user to maintenance report",
    );
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "User assigned to maintenance report successfully",
  });
}

/**
 * Handler for unassigning a user from a maintenance report. Validates the existence of the user and the maintenance report before performing the unassignment operation.
 *
 * @async
 * @function handlerUnassignUserFromMaintenanceReport
 * @param {Object} req - The request object containing the maintenance report ID in the URL parameters and the user ID in the request body.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if the user or maintenance report is not found, or if the unassignment operation fails.
 */
export async function handlerUnassignUserFromMaintenanceReport(req, res) {
  const { id } = req.params;
  const { userID } = req.body;

  if (!userID) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const maintenanceReport = await MaintenanceReport.findOne({
    where: { maintenanceReportID: id },
  });
  if (!maintenanceReport) {
    throw new NotFoundError(req, "Maintenance report not found");
  }

  const unassigned = await unassignUserFromMaintenanceReport(userID, id);
  if (!unassigned.success) {
    throw new BadRequestError(
      req,
      unassigned.message || "Failed to unassign user from maintenance report",
    );
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "User unassigned from maintenance report successfully",
  });
}
