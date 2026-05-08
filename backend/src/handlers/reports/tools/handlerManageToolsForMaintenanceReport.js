/**
 * @file handlerManageToolsForMaintenanceReport.js
 * @description Handlers for managing tools associated with maintenance reports. Includes functions to add and remove tools from a maintenance report, with validation of tool IDs and maintenance report existence.
 * @module handlers/reports/tools/handlerManageToolsForMaintenanceReport
 */
import { getTools } from "../../../services/cacheDb.js";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../../utils/json.js";
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import MaintenanceReportToolCheck from "../../../models/appdb/maintenanceReportToolCheck.js";

/**
 * Handler for removing tools from a maintenance report. Validates the existence of the maintenance report and the validity of the tool IDs.
 *
 * @async
 * @function handlerRemoveToolsFromMaintenanceReport
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if toolIDs is invalid.
 * @throws {NotFoundError} Throws an error if the maintenance report is not found.
 * @throws {InternalServerError} Throws an error if there is a failure in removing tools from the maintenance report.
 */
export async function handlerRemoveToolsFromMaintenanceReport(req, res) {
  const { id } = req.params;
  const { toolIDs } = req.body;

  if (!toolIDs || !Array.isArray(toolIDs) || toolIDs.length === 0) {
    throw new BadRequestError(req, "toolIDs must be a non-empty array");
  }

  const allTools = await getTools();
  if (!allTools.success) {
    throw new InternalServerError(
      req,
      "Failed to retrieve tools from database",
    );
  }

  const validToolIDs = allTools.data.map((tool) => tool.toolID);
  const invalidToolIDs = toolIDs.filter((id) => !validToolIDs.includes(id));
  if (invalidToolIDs.length > 0) {
    throw new BadRequestError(
      req,
      `Invalid toolIDs: ${invalidToolIDs.join(", ")}`,
    );
  }

  const maintenanceReport = await MaintenanceReport.findOne({
    where: { maintenanceReportID: id },
  });
  if (!maintenanceReport) {
    throw new NotFoundError(req, "Maintenance report not found");
  }

  for (const toolID of toolIDs) {
    await MaintenanceReportToolCheck.destroy({
      where: {
        maintenanceReportID: id,
        toolID,
      },
    });
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "Tools removed from maintenance report successfully",
  });
}

/**
 * Handler for adding tools to a maintenance report. Validates the existence of the maintenance report and the validity of the tool IDs.
 *
 * @async
 * @function handlerAddToolsToMaintenanceReport
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if toolIDs is invalid.
 * @throws {NotFoundError} Throws an error if the maintenance report is not found.
 * @throws {InternalServerError} Throws an error if there is a failure in adding tools to the maintenance report.
 */
export async function handlerAddToolsToMaintenanceReport(req, res) {
  const { id } = req.params;
  const { toolIDs } = req.body;

  if (!toolIDs || !Array.isArray(toolIDs) || toolIDs.length === 0) {
    throw new BadRequestError(req, "toolIDs must be a non-empty array");
  }

  const allTools = await getTools();
  if (!allTools.success) {
    throw new InternalServerError(
      req,
      "Failed to retrieve tools from database",
    );
  }

  const validToolIDs = allTools.data.map((tool) => tool.toolID);
  const invalidToolIDs = toolIDs.filter((id) => !validToolIDs.includes(id));
  if (invalidToolIDs.length > 0) {
    throw new BadRequestError(
      req,
      `Invalid toolIDs: ${invalidToolIDs.join(", ")}`,
    );
  }

  const maintenanceReport = await MaintenanceReport.findOne({
    where: { maintenanceReportID: id },
  });
  if (!maintenanceReport) {
    throw new NotFoundError(req, "Maintenance report not found");
  }

  for (const toolID of toolIDs) {
    await MaintenanceReportToolCheck.findOrCreate({
      where: {
        maintenanceReportID: id,
        toolID,
      },
    });
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "Tools added to maintenance report successfully",
  });
}
