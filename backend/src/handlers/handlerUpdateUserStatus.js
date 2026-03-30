/**
 * @file handlerUpdateUserStatus.js
 * @description Express handler for updating an existing user status.
 * @module handlers/handlerUpdateUserStatus
 */

import { BadRequestError } from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import Status from "../models/appdb/status.js";

/**
 * Handler for updating an existing user status.
 * Expects a URL parameter "id" for the status ID to update and a JSON body with a "name" field for the new status name.
 * Returns a success message on successful update.
 * Throws a BadRequestError if the ID or name is missing, or if the status does not exist.
 * @function handlerUpdateUserStatus
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {BadRequestError} If the status ID is not provided in the URL parameters, if the status name is not provided in the request body, or if the status does not exist.
 */
export async function handlerUpdateUserStatus(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) {
    throw new BadRequestError(req, "Status ID is required");
  }

  if (!name) {
    throw new BadRequestError(req, "Status name is required");
  }

  const updatedStatus = await Status.update(
    { statusName: name },
    { where: { statusID: id } },
  );
  if (!updatedStatus) {
    throw new BadRequestError(req, "Are you sure that status ID exists?");
  }

  respondWithJson(res, HTTPCodes.OK, {
    message: "Status updated successfully",
    data: { statusID: id, name: name },
  });
}
