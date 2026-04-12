import { getSeverityLevels } from "../../../services/cacheDb.js";
import { InternalServerError } from "../../../middleware/errorHandler.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";

export async function handlerGetSeverityLevels(req, res) {
  const severityLevels = await getSeverityLevels();

  if (!severityLevels.success) {
    throw new InternalServerError(req, "Failed to retrieve severity levels");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: severityLevels.data,
  });
}
