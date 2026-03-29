import { InternalServerError } from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import Status from "../models/appdb/status.js";

export async function handlerGetUserStatus(req, res) {
  const status = await Status.findAll();
  if (!status) {
    throw new InternalServerError(req, "Failed to retrieve user statuses");
  }

  respondWithJson(res, HTTPCodes.OK, { data: status });
}
