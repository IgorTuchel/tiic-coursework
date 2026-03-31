import User from "../models/appdb/users.js";
import {
  BadRequestError,
  InternalServerError,
  StatusCodes,
} from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { newUserRegistration } from "../services/newAccount.js";
import Status from "../models/appdb/status.js";
import Roles from "../models/appdb/roles.js";

// TEMPORARY - This will be replaced with an admin creating a user and sending them an email to set up their account
export async function handlerCreateUser(req, res) {
  const { firstName, lastName, email, mfaEnabled } = req.body;

  if (!firstName || !lastName || !email) {
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

  // TEMP
  const role = await Roles.findOne({ where: { roleName: "Admin" } });
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    roleID: role.roleID,
    statusID: pendingStatus.statusID,
    mfaEnabled: mfaEnabled || false,
  });
  // END TEMP
  if (!newUser) {
    throw new InternalServerError(req, "Failed to create user");
  }
  const { success, message } = await newUserRegistration(newUser.userID);
  if (!success) {
    throw new InternalServerError(
      req,
      message,
      StatusCodes.INTERNAL_SERVER_ERROR,
      true,
    );
  }

  respondWithJson(res, HTTPCodes.CREATED, { data: newUser });
}
