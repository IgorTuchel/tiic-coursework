import Roles from "../models/appdb/roles.js";
import User from "../models/appdb/users.js";
import { comparePassword } from "../utils/hashPassword.js";
import { handleMFA } from "../middleware/mfaVerificationMiddleware.js";
import {
  BadRequestError,
  ForbiddenError,
  StatusCodes,
  UnauthorizedError,
} from "../middleware/errorHandler.js";
import Status from "../models/appdb/status.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

export async function handlerLogin(req, res) {
  try {
    const { email, password, mfaCode } = req.body;

    //Get user from DB
    const dbUser = await User.findOne({ where: { email } });
    if (!dbUser) {
      throw new UnauthorizedError(
        req,
        "Invalid email or password",
        StatusCodes.LOGIN_FAILURE,
        true,
      );
    }

    // Check if passwords match
    const passwordMatch = await comparePassword(password, dbUser.password);
    if (!passwordMatch) {
      throw new UnauthorizedError(
        req,
        "Invalid email or password",
        StatusCodes.LOGIN_FAILURE,
        true,
      );
    }

    // Check account status
    const accountStatus = await Status.findOne({
      where: { statusID: dbUser.statusID },
    });
    if (accountStatus.statusName !== "active") {
      if (accountStatus.statusName === "pending") {
        throw new ForbiddenError(
          req,
          `Account is not set up yet.`,
          StatusCodes.LOGIN_FAILURE_ACCOUNT_NOT_SETUP,
          true,
        );
      }
      throw new ForbiddenError(
        req,
        `Account is ${accountStatus.statusName}`,
        StatusCodes.LOGIN_FAILURE_ACCOUNT_LOCKED,
        true,
      );
    }

    //Get the users role
    let { dbRole } = await Roles.findOne({ where: { roleID: dbUser.roleID } });
    if (!dbRole) {
      throw new InternalServerError(
        req,
        "User role not found",
        StatusCodes.LOGIN_FAILURE,
        true,
      );
    }

    // MFA handle
    if (dbUser.mfaEnabled || dbRole.mfaRequired) {
      if (!mfaCode) {
        throw new BadRequestError(
          req,
          "MFA code is required",
          StatusCodes.LOGIN_FAILURE_MFA_REQUIRED,
          true,
        );
      }
      const { success, data } = await handleMFA(mfaCode, dbUser.userID);
      if (!success) {
        if (data.code === HTTPCodes.FORBIDDEN) {
          throw new ForbiddenError(
            req,
            data.message,
            StatusCodes.LOGIN_FAILURE_MFA_REQUIRED,
            true,
          );
        }
        if (data.code === HTTPCodes.BAD_REQUEST) {
          throw new BadRequestError(
            req,
            data.message,
            StatusCodes.LOGIN_FAILURE_MFA_INVALID,
            true,
          );
        }
        throw new BadRequestError(
          req,
          "MFA verification failed",
          StatusCodes.LOGIN_FAILURE,
          true,
        );
      }
    }

    // Set the user's session
    req.session.regenerate((err) => {
      if (err) {
        next(err);
      }
      req.session.userID = dbUser.userID;
      req.session.roleID = dbUser.roleID;

      respondWithJson(res, StatusCodes.OK, {
        message: "Login successful",
        data: {
          email: dbUser.email,
          role: dbRole.roleName,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
        },
      });
    });
  } catch (error) {
    next(error);
  }
}
