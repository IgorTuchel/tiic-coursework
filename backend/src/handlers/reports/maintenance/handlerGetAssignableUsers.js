/**
 * @file handlerGetAssignableUsers.js
 * @description Handler for retrieving users that can be assigned to maintenance reports. Validates user permissions to ensure they have the appropriate roles to view assignable users. Responds with the list of assignable users if successful.
 * @module handlers/reports/maintenance/handlerGetAssignableUsers
 */
import { Op } from "sequelize";
import Roles from "../../../models/appdb/roles.js";
import User from "../../../models/appdb/users.js";
import { InternalServerError } from "../../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../../utils/json.js";
import Status from "../../../models/appdb/status.js";

/**
 * Handler for retrieving users that can be assigned to maintenance reports. Validates user permissions to ensure they have the appropriate roles to view assignable users. Responds with the list of assignable users if successful.
 *
 * @async
 * @function handlerGetAssignableUsers
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {InternalServerError} Throws an error if there is a failure in retrieving assignable users from the database.
 */
export async function handlerGetAssignableUsers(req, res) {
  const users = await User.findAll({
    attributes: ["userID", "firstName", "lastName", "email"],
    include: [
      {
        model: Roles,
        as: "role",
        attributes: [],
        required: true,
        where: {
          [Op.or]: [
            { "$role.isAdmin$": true },
            { "$role.canManageReports$": true },
            { "$role.canWorkOnReports$": true },
          ],
        },
      },
      {
        model: Status,
        as: "status",
        attributes: [],
        required: true,
        where: {
          statusName: "active",
        },
      },
    ],
  });

  if (!users) {
    throw new InternalServerError(req, "Failed to retrieve assignable users");
  }

  return respondWithJson(res, HTTPCodes.OK, users);
}
