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

  const user = await User.findOne({ where: { userID: id } });
  if (!user) {
    throw new NotFoundError(req, "User not found");
  }

  if (roleID) {
    const role = await Roles.findOne({ where: { roleID } });
    if (!role) {
      throw new BadRequestError(req, "Invalid roleID provided");
    }
    if (role.isAdmin) {
      const isUserAdmin = await Roles.findOne({
        where: { roleID: req.session.roleID },
      });
      if (!isUserAdmin?.isAdmin) {
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
    const status = await Status.findOne({ where: { statusID } });
    if (!status) {
      throw new BadRequestError(req, "Invalid statusID provided");
    }
    if (statusID != user.statusID) {
      const usersCurrentStatus = await Status.findOne({
        where: { statusID: user.statusID },
      });
      if (usersCurrentStatus?.statusName === "pending") {
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

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.mfaEnabled =
    mfaEnabled !== undefined ? user.mfaEnabled : user.mfaEnabled;
  user.roleID = roleID || user.roleID;
  user.statusID = statusID || user.statusID;

  const updatedUser = await user.save();

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "User updated successfully",
    data: {
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      mfaEnabled: updatedUser.mfaEnabled,
      roleID: updatedUser.roleID,
      statusID: updatedUser.statusID,
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

  const user = await User.findOne({ where: { userID: req.session.userID } });
  if (!user) {
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
    if (mfaEnabled === !user.mfaEnabled) {
      const { success, data } = await handleMFA(
        mfaCode,
        user.userID,
        user.email,
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

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.mfaEnabled =
    mfaEnabled !== undefined ? user.mfaEnabled : user.mfaEnabled;

  const updatedUser = await user.save();

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "User updated successfully",
    data: {
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      mfaEnabled: updatedUser.mfaEnabled,
    },
  });
}
