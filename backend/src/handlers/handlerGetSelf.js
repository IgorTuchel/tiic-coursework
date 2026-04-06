import User from "../models/appdb/users.js";
import { UnauthorizedError } from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import Roles from "../models/appdb/roles.js";

export async function handlerGetSelf(req, res) {
  if (!req.session?.userID) {
    throw new UnauthorizedError(req, "You are not authenticated");
  }

  if (!req.session?.roleID) {
    throw new UnauthorizedError(req, "User role not found");
  }

  const userRole = await Roles.findOne({
    where: { roleID: req.session.roleID },
  });

  if (!userRole) {
    throw new UnauthorizedError(req, "User role not found");
  }

  const user = await User.findOne({
    where: { userID: req.session.userID },
    attributes: { exclude: ["passwordHash", "userID", "roleID"] },
  });

  if (!user) {
    throw new UnauthorizedError(req, "User not found");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: {
      email: user.email,
      role: userRole.roleName,
      firstName: user.firstName,
      lastName: user.lastName,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
    },
  });
}
