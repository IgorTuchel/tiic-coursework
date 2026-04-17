import { UnauthorizedError } from "../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../utils/json.js";
import { getUserRoleByID, getUserByID } from "../../services/cacheDb.js";

export async function handlerGetSelf(req, res) {
  if (!req.session?.userID) {
    throw new UnauthorizedError(req, "You are not authenticated");
  }

  if (!req.session?.roleID) {
    throw new UnauthorizedError(req, "User role not found");
  }

  const userRole = await getUserRoleByID(req.session.roleID);
  if (!userRole.success) {
    throw new UnauthorizedError(req, userRole.message);
  }

  const user = await getUserByID(req.session.userID);
  if (!user.success) {
    throw new UnauthorizedError(req, user.message);
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: {
      email: user.data.email,
      role: userRole.data.roleName,
      firstName: user.data.firstName,
      lastName: user.data.lastName,
      mfaEnabled: user.data.mfaEnabled,
      createdAt: user.data.createdAt,
    },
  });
}
