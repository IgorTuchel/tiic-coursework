import Roles from "../models/appdb/roles.js";
import User from "../models/appdb/users.js";
import { comparePassword } from "../utils/hashPassword.js";
import { handleMFA } from "../middleware/mfaVerificationMiddleware.js";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  StatusCodes,
  UnauthorizedError,
} from "../middleware/errorHandler.js";
import Status from "../models/appdb/status.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { newUserRegistration } from "../services/newAccount.js";

export async function handlerLogin(req, res) {
  const { email, password, mfaCode = "" } = req.body;

  if (!email) {
    throw new BadRequestError(
      req,
      "Email is required",
      StatusCodes.BAD_REQUEST,
      true,
    );
  }

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

  // Check account status
  const accountStatus = await Status.findOne({
    where: { statusID: dbUser.statusID },
  });

  if (!accountStatus) {
    throw new InternalServerError(
      req,
      "User account status not found",
      StatusCodes.LOGIN_FAILURE,
      true,
    );
  }

  if (accountStatus.statusName === "pending") {
    await newUserRegistration(dbUser.userID); // Resend the registration email
    throw new ForbiddenError(
      req,
      `Account is not set up yet, an email has been sent with instructions to set up your account. If you haven't received the email, please check your spam folder or contact support.`,
      StatusCodes.LOGIN_FAILURE_ACCOUNT_NOT_SETUP,
      true,
    );
  }

  if (!password) {
    throw new BadRequestError(
      req,
      "Password is required",
      StatusCodes.BAD_REQUEST,
      true,
    );
  }

  // Check if passwords match
  const passwordMatch = await comparePassword(password, dbUser.passwordHash);
  if (!passwordMatch) {
    throw new UnauthorizedError(
      req,
      "Invalid email or password",
      StatusCodes.LOGIN_FAILURE,
      true,
    );
  }

  if (accountStatus.statusName !== "active") {
    throw new ForbiddenError(
      req,
      `Account is ${accountStatus.statusName}`,
      StatusCodes.LOGIN_FAILURE_ACCOUNT_LOCKED,
      true,
    );
  }

  //Get the users role
  let dbRole = await Roles.findOne({ where: { roleID: dbUser.roleID } });
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
    const { success, data } = await handleMFA(
      mfaCode,
      dbUser.userID,
      dbUser.email,
    );
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
          StatusCodes.LOGIN_FAILURE,
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

  // Set user sessuib
  await new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err)
        return reject(
          new InternalServerError(
            req,
            "Failed to create session",
            StatusCodes.LOGIN_FAILURE,
            true,
          ),
        );
      resolve();
    });
  });

  req.session.userID = dbUser.userID;
  req.session.roleID = dbUser.roleID;

  return respondWithJson(res, HTTPCodes.OK, {
    message: "Login successful",
    data: {
      email: dbUser.email,
      role: dbRole.roleName,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
    },
  });
}
