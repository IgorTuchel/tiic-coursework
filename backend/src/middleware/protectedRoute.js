/**
 * @file protectedRoute.js
 * @description Middleware for protected routes.
 * @module Middleware/protectedRoute
 */
import { UnauthorizedError, StatusCodes } from "./errorHandler.js";

/**
 * Middleware for protected routes.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export async function protectedRoute(req, res, next) {
    if (!req.session || !req.session.userID || !req.session.roleID) {
        throw new UnauthorizedError(
            req,
            "You are not authenticated",
            StatusCodes.UNAUTHORIZED,
            false,
        );
    }
    next();
}
