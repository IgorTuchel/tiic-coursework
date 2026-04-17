/**
 * @file handlerCreateUserStatus.js
 * @description Express handler for creating a new user status.
 * @module handlers/handlerCreateUserStatus
 */
import {
  BadRequestError,
  InternalServerError,
} from "../../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../../utils/json.js";
import Status from "../../../models/appdb/status.js";
import { invalidateUserStatusesCache } from "../../../services/cacheDb.js";

/**
 * Handler for creating a new user status.
 * Expects a JSON body with a "name" field for the status name.
 * Returns the created status object on success.
 * Throws a BadRequestError if the name is missing, or an InternalServerError if creation fails.
 * @function handlerCreateUserStatus
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {BadRequestError} If the status name is not provided in the request body.
 * @throws {InternalServerError} If there is an error creating the user status in the database.
 */
export async function handlerCreateUserStatus(req, res) {
  const { name } = req.body;

  if (!name) {
    throw new BadRequestError(req, "Status name is required");
  }

  const existingStatus = await Status.findOne({ where: { statusName: name } });
  if (existingStatus) {
    throw new BadRequestError(req, "Status name already exists");
  }

  const newStatus = await Status.create({ statusName: name });
  if (!newStatus) {
    console.error("Failed to create user status:", newStatus);
    throw new InternalServerError(req, "Failed to create user status");
  }

  await invalidateUserStatusesCache();

  respondWithJson(res, HTTPCodes.OK, { data: newStatus });
}
