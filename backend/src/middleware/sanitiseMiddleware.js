import { HTTPCodes, respondWithErrorJson } from "../utils/json.js";
import { StatusCodes } from "./errorHandler.js";

export async function sanitiseInputMiddleware(req, res, next) {
  try {
    req.body = req.body || {};
    next();
  } catch (err) {
    return respondWithErrorJson(
      res,
      HTTPCodes.INTERNAL_SERVER_ERROR,
      "Error processing request",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
