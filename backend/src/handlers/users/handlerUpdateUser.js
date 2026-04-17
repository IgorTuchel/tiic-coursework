import User from "../../models/appdb/users.js";
import Status from "../../models/appdb/status.js";
import Roles from "../../models/appdb/roles.js";
import {
  NotFoundError,
  BadRequestError,
  StatusCodes,
  ForbiddenError,
} from "../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../utils/json.js";
import { handleMFA } from "../../middleware/mfaVerificationMiddleware.js";
import {
  getUserByID,
  getUserRoleByID,
  getUserStatusByID,
  invalidateUserCache,
} from "../../services/cacheDb.js";

export async function handlerUpdateUser(req, res) {
  const { id } = req.params;
  const { firstName, lastName, mfaEnabled, roleID, statusID } = req.body;

  if (
    !firstName &&
    !lastName &&
    mfaEnabled === undefined &&
    !roleID &&
    !statusID
  ) {
    throw new BadRequestError(
      req,
      "At least one field must be provided to update",
    );
  }

  const user = await getUserByID(id);
  if (!user.success) {
    throw new NotFoundError(req, "User not found");
  }

  if (roleID) {
    const role = await getUserRoleByID(roleID);
    if (!role.success) {
      throw new BadRequestError(req, "Invalid roleID provided");
    }
    if (role.data.isAdmin) {
      const isUserAdmin = await getUserRoleByID(req.session.roleID);
      if (!isUserAdmin.success || !isUserAdmin.data.isAdmin) {
        throw new BadRequestError(
          req,
          "Only admin users can be assigned the admin role",
          StatusCodes.BAD_REQUEST,
          true,
        );
      }
    }
  }

  if (statusID) {
    const status = await getUserStatusByID(statusID);
    if (!status.success) {
      throw new BadRequestError(req, "Invalid statusID provided");
    }
    if (statusID != user.data.statusID) {
      const usersCurrentStatus = await getUserStatusByID(user.data.statusID);
      if (!usersCurrentStatus.success) {
        throw new InternalServerError(
          req,
          "Failed to retrieve user's current status",
        );
      }
      if (usersCurrentStatus.data.statusName === "pending") {
        throw new BadRequestError(
          req,
          "Cannot update user that is not set up yet",
          StatusCodes.BAD_REQUEST,
          true,
        );
      }
    }
  }

  if (mfaEnabled !== undefined) {
    if (mfaEnabled !== true && mfaEnabled !== false) {
      throw new BadRequestError(
        req,
        "mfaEnabled must be a boolean value",
        StatusCodes.BAD_REQUEST,
        true,
      );
    }
  }
  await User.update(
    {
      firstName: firstName || user.data.firstName,
      lastName: lastName || user.data.lastName,
      mfaEnabled: mfaEnabled !== undefined ? mfaEnabled : user.data.mfaEnabled,
      roleID: roleID || user.data.roleID,
      statusID: statusID || user.data.statusID,
    },
    { where: { userID: id } },
  );

  await invalidateUserCache(id);

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "User updated successfully",
    data: {
      email: user.data.email,
      firstName: firstName || user.data.firstName,
      lastName: lastName || user.data.lastName,
      mfaEnabled: mfaEnabled !== undefined ? mfaEnabled : user.data.mfaEnabled,
      roleID: roleID || user.data.roleID,
      statusID: statusID || user.data.statusID,
    },
  });
}

export async function handlerUpdateSelf(req, res) {
  const { firstName, lastName, mfaEnabled, mfaCode } = req.body;

  if (!firstName && !lastName && mfaEnabled === undefined) {
    throw new BadRequestError(
      req,
      "At least one field must be provided to update",
      StatusCodes.BAD_REQUEST,
      true,
    );
  }

  const user = await getUserByID(req.session.userID);
  if (!user.success) {
    throw new NotFoundError(req, "User not found");
  }

  if (mfaEnabled !== undefined) {
    if (mfaEnabled !== true && mfaEnabled !== false) {
      throw new BadRequestError(
        req,
        "mfaEnabled must be a boolean value",
        StatusCodes.BAD_REQUEST,
        true,
      );
    }
    if (mfaEnabled === !user.data.mfaEnabled) {
      const { success, data } = await handleMFA(
        mfaCode,
        user.data.userID,
        user.data.email,
      );
      if (!success) {
        if (data.code === HTTPCodes.FORBIDDEN) {
          throw new ForbiddenError(
            req,
            data.message,
            StatusCodes.ACTION_REQUIRE_MFA,
            true,
          );
        }
        if (data.code === HTTPCodes.BAD_REQUEST) {
          throw new BadRequestError(
            req,
            data.message,
            StatusCodes.BAD_REQUEST,
            true,
          );
        }
        throw new BadRequestError(
          req,
          "MFA verification failed",
          StatusCodes.BAD_REQUEST,
          true,
        );
      }
    }
  }

  await User.update(
    {
      firstName: firstName || user.data.firstName,
      lastName: lastName || user.data.lastName,
      mfaEnabled: mfaEnabled !== undefined ? mfaEnabled : user.data.mfaEnabled,
    },
    { where: { userID: req.session.userID } },
  );

  await invalidateUserCache(req.session.userID);

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "User updated successfully",
    data: {
      email: user.data.email,
      firstName: firstName || user.data.firstName,
      lastName: lastName || user.data.lastName,
      mfaEnabled: mfaEnabled !== undefined ? mfaEnabled : user.data.mfaEnabled,
    },
  });
}
