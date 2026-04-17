import { getReportStatuses } from "../../../services/cacheDb.js";
import { InternalServerError } from "../../../middleware/errorHandler.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";

export async function handlerGetReportStatuses(req, res) {
  const reportStatuses = await getReportStatuses();

  if (!reportStatuses.success) {
    throw new InternalServerError(req, "Failed to retrieve report statuses");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: reportStatuses.data,
  });
}
