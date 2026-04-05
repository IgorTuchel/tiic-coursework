import { ForbiddenError, StatusCodes } from "./errorHandler.js";
import Roles from "../models/appdb/roles.js";

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
    const role = await Roles.findOne({ where: { roleID: userRole } });
    if (!role) {
      throw new ForbiddenError(
        req,
        "User role not found",
        StatusCodes.FORBIDDEN,
        false,
      );
    }
    if (role.isAdmin) {
      return next();
    }
    if (!role[requiredPermissions]) {
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
