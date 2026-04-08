import { getUserRoles } from "../../../services/cacheDb.js";
import { InternalServerError } from "../../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../../utils/json.js";

export async function handlerGetUserRoles(req, res) {
  const userRoles = await getUserRoles();
  if (!userRoles.success) {
    throw new InternalServerError(req, userRoles.message);
  }

  respondWithJson(res, HTTPCodes.OK, { success: true, data: userRoles.data });
}
