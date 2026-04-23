import { Op } from "sequelize";
import Roles from "../../../models/appdb/roles.js";
import User from "../../../models/appdb/users.js";
import { InternalServerError } from "../../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../../utils/json.js";
import Status from "../../../models/appdb/status.js";

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
            { "$role.canManageFaults$": true },
            { "$role.canSuggestFaults$": true },
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

  return respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: users,
  });
}
