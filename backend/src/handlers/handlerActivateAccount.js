import {
  BadRequestError,
  StatusCodes,
  InternalServerError,
} from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { verifyNewUser } from "../services/newAccount.js";
import { evaulatePassword } from "../utils/passwordStrength.js";
import { hashPassword } from "../utils/hashPassword.js";
import User from "../models/appdb/users.js";
import Status from "../models/appdb/status.js";

export async function handlerActivateAccount(req, res) {
  const { id } = req.query;
  if (!id) {
    throw new BadRequestError(
      req,
      "Missing activation code",
      StatusCodes.BAD_REQUEST,
      true,
    );
  }

  const { password } = req.body;
  if (!password) {
    throw new BadRequestError(
      req,
      "Missing password",
      StatusCodes.BAD_REQUEST,
      true,
    );
  }

  const { valid, reason } = evaulatePassword(password);
  if (!valid) {
    throw new BadRequestError(req, reason, StatusCodes.BAD_REQUEST, true);
  }

  const { success, message, userID } = await verifyNewUser(id);
  if (!success) {
    throw new BadRequestError(req, message, StatusCodes.BAD_REQUEST, true);
  }

  const dbUser = await User.findByPk(userID);
  if (!dbUser) {
    throw new InternalServerError(
      req,
      "User not found during activation",
      StatusCodes.INTERNAL_SERVER_ERROR,
      true,
    );
  }

  const pendingStatus = await Status.findOne({
    where: { statusName: "pending" },
  });
  if (dbUser.statusID !== pendingStatus.statusID) {
    throw new BadRequestError(
      req,
      "Account already activated",
      StatusCodes.BAD_REQUEST,
      true,
    );
  }

  const hashedPassword = await hashPassword(password);

  const activeStatus = await Status.findOne({
    where: { statusName: "active" },
  });
  if (!activeStatus) {
    throw new InternalServerError(
      req,
      "Active status not found in database",
      StatusCodes.INTERNAL_SERVER_ERROR,
      true,
    );
  }

  const updatedUser = await User.update(
    { passwordHash: hashedPassword, statusID: activeStatus.statusID },
    { where: { userID } },
  );

  respondWithJson(res, HTTPCodes.OK, {
    message: "Account activated successfully",
  });
}
