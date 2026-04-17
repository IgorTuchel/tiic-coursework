import User from "../../models/appdb/users.js";
import Status from "../../models/appdb/status.js";
import {
  NotFoundError,
  InternalServerError,
  ForbiddenError,
} from "../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../utils/json.js";
import {
  getUserByID,
  getUserRoleByID,
  getUserStatuses,
  invalidateUserCache,
} from "../../services/cacheDb.js";

export async function handlerDeactivateAccount(req, res) {
  const { id } = req.params;

  const user = await getUserByID(id);
  if (!user.success) {
    throw new NotFoundError(req, "User not found");
  }

  const deactivatedStatus = await getUserStatuses()
    .then((res) => {
      if (!res.success) {
        throw new InternalServerError(req, res.message);
      }
      return res.data.find((status) => status.statusName === "deactivated");
    })
    .catch((err) => {
      throw new InternalServerError(req, err.message);
    });

  if (!deactivatedStatus) {
    throw new InternalServerError(req, "Deactivated status not found");
  }

  const userCurrentRole = await getUserRoleByID(req.session.roleID);
  if (!userCurrentRole.success) {
    throw new InternalServerError(req, userCurrentRole.message);
  }

  const targetUserRole = await getUserRoleByID(user.data.roleID);
  if (!targetUserRole.success) {
    throw new InternalServerError(req, targetUserRole.message);
  }

  if (targetUserRole.data.isAdmin && !userCurrentRole.data.isAdmin) {
    throw new ForbiddenError(
      req,
      "You do not have permission to deactivate an admin account",
    );
  }

  const updatedUser = await User.update(
    { statusID: deactivatedStatus.statusID },
    { where: { userID: id } },
  );

  if (!updatedUser) {
    throw new InternalServerError(req, "Failed to deactivate account");
  }

  await invalidateUserCache(id);

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "Account deactivated successfully",
  });
}
