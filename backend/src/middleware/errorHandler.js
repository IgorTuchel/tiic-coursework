import { HTTPCodes, respondWithErrorJson } from "../utils/json.js";

export async function errorHandlingMiddleware(err, req, res, next) {
  if (err instanceof HTTPRequestError) {
    return respondWithErrorJson(res, err.statusCode, err.message);
  }

  console.log("Unexpected Error!", err.stack);
}

class HTTPRequestError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends HTTPRequestError {
  constructor(message) {
    super(message, HTTPCodes.BAD_REQUEST);
  }
}

export class UnauthorizedError extends HTTPRequestError {
  constructor(message) {
    super(message, HTTPCodes.UNAUTHORIZED);
  }
}

export class ForbiddenError extends HTTPRequestError {
  constructor(message) {
    super(message, HTTPCodes.FORBIDDEN);
  }
}

export class NotFoundError extends HTTPRequestError {
  constructor(message) {
    super(message, HTTPCodes.NOT_FOUND);
  }
}
