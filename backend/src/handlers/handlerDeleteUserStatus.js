import { BadRequestError } from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import Status from "../models/appdb/status.js";

export async function handlerDeleteUserStatus(req, res) {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError(req, "Status ID is required");
  }

  const deletedStatus = await Status.destroy({ where: { statusID: id } });
  if (!deletedStatus) {
    throw new BadRequestError(req, "Are you sure that status ID exists?");
  }

  respondWithJson(res, HTTPCodes.OK, {
    message: "Status deleted successfully",
    data: { statusID: id },
  });
}
