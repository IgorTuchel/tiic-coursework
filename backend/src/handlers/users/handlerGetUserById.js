import {
  BadRequestError,
  UnauthorizedError,
} from "../../middleware/errorHandler.js";
import Roles from "../../models/appdb/roles.js";
import User from "../../models/appdb/users.js";
import { HTTPCodes, respondWithJson } from "../../utils/json.js";

export async function handlerGetUserById(req, res) {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError(req, "User ID is required");
  }

  const userRole = await Roles.findOne({
    where: { roleID: req.session?.roleID },
  });

  if (!userRole) {
    throw new UnauthorizedError(
      req,
      "User not found or you do not have permission to view this user's information",
    );
  }

  const user = await User.findOne({
    where: { userID: id },
    attributes: { exclude: ["passwordHash"] },
  });

  if (!user) {
    throw new UnauthorizedError(
      req,
      "User not found or you do not have permission to view this user's information",
    );
  }

  if (id !== req.session?.userID && userRole.isAdmin !== true) {
    throw new UnauthorizedError(
      req,
      "User not found or you do not have permission to view this user's information",
    );
  }

  respondWithJson(res, HTTPCodes.OK, { success: true, data: user });
}
