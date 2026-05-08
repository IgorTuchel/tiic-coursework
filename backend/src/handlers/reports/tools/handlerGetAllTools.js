/**
 * @file handlerGetAllTools.js
 * @description Handler for retrieving all tools. Responds with the list of tools if successful.
 * @module handlers/reports/tools/handlerGetAllTools
 */
import { getTools } from "../../../services/cacheDb.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import { InternalServerError } from "../../../middleware/errorHandler.js";

/**
 * Handler for retrieving all tools. Responds with the list of tools if successful.
 *
 * @async
 * @function handlerGetAllTools
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {InternalServerError} Throws an error if there is a failure in retrieving tools from the database.
 */
export async function handlerGetAllTools(req, res) {
  const tools = await getTools();
  if (!tools.success) {
    throw new InternalServerError(req, "Failed to retrieve tools");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: tools.data,
  });
}
