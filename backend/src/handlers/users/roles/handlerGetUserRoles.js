/**
 * @file handlerGetUserRoles.js
 * @description Handler for retrieving user roles. Responds with the list of user roles if successful.
 * @module handlers/users/roles/handlerGetUserRoles
 */
import { getUserRoles } from "../../../services/cacheDb.js";
import { InternalServerError } from "../../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../../utils/json.js";

/**
 * Handler for retrieving user roles. Responds with the list of user roles if successful.
 *
 * @async
 * @function handlerGetUserRoles
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {InternalServerError} Throws an error if there is a failure in retrieving user roles from the database.
 */
export async function handlerGetUserRoles(req, res) {
  const userRoles = await getUserRoles();
  if (!userRoles.success) {
    throw new InternalServerError(req, userRoles.message);
  }

  respondWithJson(res, HTTPCodes.OK, { success: true, data: userRoles.data });
}
