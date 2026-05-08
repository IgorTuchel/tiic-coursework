/**
 * @file handlerGetReportStatus.js
 * @description Handler for retrieving report statuses. Responds with the list of report statuses if successful.
 * @module handlers/reports/status/handlerGetReportStatus
 */
import { getReportStatuses } from "../../../services/cacheDb.js";
import { InternalServerError } from "../../../middleware/errorHandler.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";

/**
 * Handler for retrieving report statuses. Responds with the list of report statuses if successful.
 *
 * @async
 * @function handlerGetReportStatuses
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {InternalServerError} Throws an error if there is a failure in retrieving report statuses from the database.
 */
export async function handlerGetReportStatuses(req, res) {
  const reportStatuses = await getReportStatuses();

  if (!reportStatuses.success) {
    throw new InternalServerError(req, "Failed to retrieve report statuses");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: reportStatuses.data,
  });
}
