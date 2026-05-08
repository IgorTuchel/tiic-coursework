/**
 * @file handlerGetSeverityLevels.js
 * @description Handler for retrieving severity levels for reports.  Responds with the list of severity levels if successful.
 * @module handlers/reports/severity/handlerGetSeverityLevels
 */
import { getSeverityLevels } from "../../../services/cacheDb.js";
import { InternalServerError } from "../../../middleware/errorHandler.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";

/**
 * Handler for retrieving severity levels for reports.  Responds with the list of severity levels if successful.
 *
 * @async
 * @function handlerGetSeverityLevels
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {InternalServerError} Throws an error if there is a failure in retrieving severity levels from the database.
 */
export async function handlerGetSeverityLevels(req, res) {
  const severityLevels = await getSeverityLevels();

  if (!severityLevels.success) {
    throw new InternalServerError(req, "Failed to retrieve severity levels");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: severityLevels.data,
  });
}
