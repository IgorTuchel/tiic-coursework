/**
 * @file handlerLogout.js
 * @description Handler for user logout.
 * @module handlers/handlerLogout.js
 */
import { InternalServerError } from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

/**
 * Logs out the user.
 * @async
 * @function handlerLogout
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function handlerLogout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session during logout:", err);
            throw new InternalServerError(req, "Failed to log out");
        }
        res.clearCookie("connect.sid", { path: "/" });
        respondWithJson(res, HTTPCodes.OK, {
            success: true,
            message: "Logged out successfully",
        });
    });
}
