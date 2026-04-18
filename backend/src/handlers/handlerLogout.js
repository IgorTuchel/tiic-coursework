import { InternalServerError } from "../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

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
