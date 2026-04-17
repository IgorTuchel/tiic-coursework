import { getTools } from "../../../services/cacheDb.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import { InternalServerError } from "../../../middleware/errorHandler.js";

export async function handlerGetAllTools(req, res) {
  const tools = await getTools();
  if (!tools.success) {
    throw new InternalServerError(req, "Failed to retrieve tools");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: tools.data,
  });
}
