import { InternalServerError } from "../../middleware/errorHandler.js";
import User from "../../models/appdb/users.js";
import { HTTPCodes, respondWithJson } from "../../utils/json.js";

export async function handlerGetAllUsers(req, res) {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash", "roleID", "statusID"] },
    include: [
      {
        association: "role",
        attributes: ["roleName", "roleID"],
      },
      {
        association: "status",
        attributes: ["statusName", "statusID"],
      },
    ],
  });

  if (!users) {
    throw new InternalServerError(req, "Failed to retrieve users");
  }

  respondWithJson(res, HTTPCodes.OK, { success: true, data: users });
}
