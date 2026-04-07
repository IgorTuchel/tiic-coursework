import User from "../../models/appdb/users.js";
import Status from "../../models/appdb/status.js";
import {
  NotFoundError,
  InternalServerError,
  ForbiddenError,
} from "../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../utils/json.js";

export async function handlerDeactivateAccount(req, res) {
  const { id } = req.params;

  const user = await User.findOne({ where: { userID: id } });
  if (!user) {
    throw new NotFoundError(req, "User not found");
  }

  const deactivatedStatus = await Status.findOne({
    where: { statusName: "deactivated" },
  });
  if (!deactivatedStatus) {
    throw new InternalServerError(req, "Deactivated status not found");
  }

  const userCurrentRole = await User.findOne({
    where: { userID: req.session.userID },
    include: "role",
  });

  const targetUserRole = await User.findOne({
    where: { userID: id },
    include: "role",
  });

  if (targetUserRole.role.isAdmin && !userCurrentRole.role.isAdmin) {
    throw new ForbiddenError(
      req,
      "You do not have permission to deactivate an admin account",
    );
  }

  user.statusID = deactivatedStatus.statusID;
  await user.save();

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "Account deactivated successfully",
  });
}
