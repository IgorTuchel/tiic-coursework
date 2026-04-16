import { BadRequestError } from "../../../middleware/errorHandler.js";
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import { assignUserToMaintenanceReport } from "../../../services/workOnReport.js";
import { NotFoundError } from "../../../middleware/errorHandler.js";
import { unassignUserFromMaintenanceReport } from "../../../services/workOnReport.js";

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
