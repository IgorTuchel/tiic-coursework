import {
  BadRequestError,
  InternalServerError,
} from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import Status from "../models/appdb/status.js";

export async function handlerCreateUserStatus(req, res) {
  const { name } = req.body;

  if (!name) {
    throw new BadRequestError(req, "Status name is required");
  }

  const newStatus = await Status.create({ statusName: name });
  if (!newStatus) {
    throw new InternalServerError(req, "Failed to create user status");
  }

  respondWithJson(res, HTTPCodes.OK, { data: newStatus });
}
