/**
 * @file sanitiseMiddleware.js
 * @description Middleware for sanitising input.
 */
import { HTTPCodes, respondWithErrorJson } from "../utils/json.js";
import { StatusCodes } from "./errorHandler.js";

/**
 * Middleware for simply attaching a request body to the request object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
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
