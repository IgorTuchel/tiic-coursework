import { comparePassword } from "../utils/hashPassword.js";
import { handleMFA } from "../middleware/mfaVerificationMiddleware.js";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  StatusCodes,
  UnauthorizedError,
} from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { newUserRegistration } from "../services/newAccount.js";
import {
  getUserByEmail,
  getUserRoleByID,
  getUserStatusByID,
  invalidateUserCache,
} from "../services/cacheDb.js";

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
  const dbUser = await getUserByEmail(email);
  if (!dbUser.success) {
    throw new UnauthorizedError(
      req,
      "Invalid email or password",
      StatusCodes.LOGIN_FAILURE,
      true,
    );
  }

  // Check account status
  const accountStatus = await getUserStatusByID(dbUser.data.statusID);
  if (!accountStatus.success) {
    throw new InternalServerError(
      req,
      "User account status not found",
      StatusCodes.LOGIN_FAILURE,
      true,
    );
  }

  if (accountStatus.data.statusName === "pending") {
    await newUserRegistration(dbUser.data.userID); // Resend the registration email
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
  const passwordMatch = await comparePassword(
    password,
    dbUser.data.passwordHash,
  );
  if (!passwordMatch) {
    throw new UnauthorizedError(
      req,
      "Invalid email or password",
      StatusCodes.LOGIN_FAILURE,
      true,
    );
  }

  if (accountStatus.data.statusName !== "active") {
    throw new ForbiddenError(
      req,
      `Account is ${accountStatus.data.statusName}`,
      StatusCodes.LOGIN_FAILURE_ACCOUNT_LOCKED,
      true,
    );
  }

  //Get the users role
  let dbRole = await getUserRoleByID(dbUser.data.roleID);
  if (!dbRole.success) {
    throw new InternalServerError(
      req,
      "User role not found",
      StatusCodes.LOGIN_FAILURE,
      true,
    );
  }

  // MFA handle
  if (dbUser.data.mfaEnabled || dbRole.data.mfaRequired) {
    const { success, data } = await handleMFA(
      mfaCode,
      dbUser.data.userID,
      dbUser.data.email,
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

  // Set user session
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

  req.session.userID = dbUser.data.userID;
  req.session.roleID = dbUser.data.roleID;

  return respondWithJson(res, HTTPCodes.OK, {
    message: "Login successful",
    data: {
      email: dbUser.data.email,
      role: dbRole.data.roleName,
      firstName: dbUser.data.firstName,
      lastName: dbUser.data.lastName,
      mfaEnabled: dbUser.data.mfaEnabled,
      createdAt: dbUser.data.createdAt,
    },
  });
}
