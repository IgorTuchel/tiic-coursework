import { BadRequestError } from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import Status from "../models/appdb/status.js";

export async function handlerUpdateUserStatus(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) {
    throw new BadRequestError(req, "Status ID is required");
  }

  if (!name) {
    throw new BadRequestError(req, "Status name is required");
  }

  const updatedStatus = await Status.update(
    { statusName: name },
    { where: { statusID: id } },
  );
  if (!updatedStatus) {
    throw new BadRequestError(req, "Are you sure that status ID exists?");
  }

  respondWithJson(res, HTTPCodes.OK, {
    message: "Status updated successfully",
    data: { statusID: id, name: name },
  });
}
