import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../middleware/errorHandler.js";
import {
  getUserByID,
  getUserRoleByID,
  getUserStatusByID,
} from "../../services/cacheDb.js";
import { HTTPCodes, respondWithJson } from "../../utils/json.js";

export async function handlerGetUserById(req, res) {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError(req, "User ID is required");
  }

  const userRole = await getUserRoleByID(req.session.roleID);
  if (!userRole.success) {
    throw new UnauthorizedError(req, "User role not found");
  }

  const user = await getUserByID(id);
  console.log(user);
  if (!user.success) {
    throw new UnauthorizedError(req, "User not found");
  }

  const targetUserRole = await getUserRoleByID(user.data.roleID);
  if (!targetUserRole.success) {
    throw new InternalServerError(req, targetUserRole.message);
  }

  const targetUserStatus = await getUserStatusByID(user.data.statusID);
  if (!targetUserStatus.success) {
    throw new InternalServerError(req, targetUserStatus.message);
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: {
      userID: user.data.userID,
      email: user.data.email,
      role: targetUserRole.data.roleName,
      firstName: user.data.firstName,
      lastName: user.data.lastName,
      status: targetUserStatus.data.statusName,
      mfaEnabled: user.data.mfaEnabled,
      createdAt: user.data.createdAt,
    },
  });
}
