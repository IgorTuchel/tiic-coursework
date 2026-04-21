import { ForbiddenError, StatusCodes } from "./errorHandler.js";
import { getUserRoleByID } from "../services/cacheDb.js";

export function permissionGuard(requiredPermissions) {
  return async (req, res, next) => {
    const userRole = req?.session?.roleID;
    const userID = req?.session?.userID;
    if (!userID) {
      throw new ForbiddenError(
        req,
        "User not authenticated",
        StatusCodes.UNAUTHORIZED,
        false,
      );
    }
    if (!userRole) {
      throw new ForbiddenError(
        req,
        "User role not found in session",
        StatusCodes.FORBIDDEN,
        false,
      );
    }
    const role = await getUserRoleByID(userRole);
    if (!role.success) {
      throw new ForbiddenError(
        req,
        "User role not found",
        StatusCodes.FORBIDDEN,
        false,
      );
    }
    if (role.data.isAdmin) {
      return next();
    }
    if (!role.data[requiredPermissions]) {
      console.log(
        `User ${userID} with role ${role.data.roleName} does not have required permissions: ${requiredPermissions}`,
      );
      throw new ForbiddenError(
        req,
        "User does not have required permissions",
        StatusCodes.FORBIDDEN,
        false,
      );
    }
    next();
  };
}
