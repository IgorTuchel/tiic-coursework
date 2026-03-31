/**
 * @file handlerDeleteUserStatus.js
 * @description Express handler for deleting a user status.
 * @module handlers/handlerDeleteUserStatus
 */

import { BadRequestError } from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import Status from "../models/appdb/status.js";

/**
 * Handler for deleting a user status.
 * Expects a URL parameter "id" for the status ID to delete.
 * Returns a success message on successful deletion.
 * Throws a BadRequestError if the ID is missing or if the status does not exist.
 * @function handlerDeleteUserStatus
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {BadRequestError} If the status ID is not provided in the URL parameters or if the status does not exist.
 */
export async function handlerDeleteUserStatus(req, res) {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError(req, "Status ID is required");
  }

  const deletedStatus = await Status.destroy({ where: { statusID: id } });
  if (!deletedStatus) {
    throw new BadRequestError(req, "Are you sure that status ID exists?");
  }

  respondWithJson(res, HTTPCodes.OK, {
    message: "Status deleted successfully",
    data: { statusID: id },
  });
}
