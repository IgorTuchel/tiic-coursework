/**
 * @file handlerCreateUser.js
 * @description Handler for creating a new user. Validates input data, checks for existing email, assigns pending status, and creates the user in the database. Responds with the created user's information if successful.
 * @module handlers/users/handlerCreateUser
 */
import User from "../../models/appdb/users.js";
import {
  BadRequestError,
  InternalServerError,
  StatusCodes,
} from "../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../utils/json.js";
import { newUserRegistration } from "../../services/newAccount.js";
import Status from "../../models/appdb/status.js";
import Roles from "../../models/appdb/roles.js";
import { getUserRoleByID } from "../../services/cacheDb.js";

/**
 * Handler for creating a new user. Validates input data, checks for existing email, assigns pending status, and creates the user in the database. Responds with the created user's information if successful.
 *
 * @async
 * @function handlerCreateUser
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if required fields are missing or invalid.
 * @throws {InternalServerError} Throws an error if there is a failure in creating the user or registering the new account.
 */
export async function handlerCreateUser(req, res) {
  const { firstName, lastName, email, mfaEnabled, roleID } = req.body;

  if (!firstName || !lastName || !email || !roleID) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new BadRequestError(
      req,
      "Email already in use",
      StatusCodes.BAD_REQUEST,
      true,
    );
  }

  const pendingStatus = await Status.findOne({
    where: { statusName: "pending" },
  });
  if (!pendingStatus) {
    throw new InternalServerError(
      req,
      "Pending status not found in database",
      StatusCodes.INTERNAL_SERVER_ERROR,
      true,
    );
  }

  const { success: roleSuccess, data: role } = await getUserRoleByID(roleID);
  if (!roleSuccess) {
    throw new BadRequestError(
      req,
      "Invalid roleID provided",
      StatusCodes.BAD_REQUEST,
      true,
    );
  }

  if (role.isAdmin) {
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

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    roleID: role.roleID,
    statusID: pendingStatus.statusID,
    mfaEnabled: mfaEnabled || false,
  });

  if (!newUser) {
    throw new InternalServerError(req, "Failed to create user");
  }
  const { success, message } = await newUserRegistration(newUser.userID);
  if (!success) {
    await newUser.destroy();
    throw new InternalServerError(
      req,
      message,
      StatusCodes.INTERNAL_SERVER_ERROR,
      true,
    );
  }

  const createdUser = {
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    roleID: newUser.roleID,
    mfaEnabled: newUser.mfaEnabled,
    statusID: newUser.statusID,
  };

  respondWithJson(res, HTTPCodes.CREATED, { data: createdUser });
}
