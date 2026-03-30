/**
 * @file handlerGetUserStatus.js
 * @description Express handler for retrieving all user statuses.
 * @module handlers/handlerGetUserStatus
 */

import { InternalServerError } from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import Status from "../models/appdb/status.js";

/**
 * Handler for retrieving all user statuses.
 * Returns an array of status objects on success.
 * Throws an InternalServerError if retrieval fails.
 * @function handlerGetUserStatus
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {InternalServerError} If there is an error retrieving user statuses from the database.
 */
export async function handlerGetUserStatus(req, res) {
  const status = await Status.findAll();
  if (!status) {
    throw new InternalServerError(req, "Failed to retrieve user statuses");
  }

  respondWithJson(res, HTTPCodes.OK, { data: status });
}
