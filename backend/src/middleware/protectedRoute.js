import { UnauthorizedError, StatusCodes } from "./errorHandler.js";

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
