/**
 * @file errorHandler.js
 * @description Centralized error handling middleware and custom error classes for the application. This module defines a hierarchy of error classes to represent various error conditions that can occur during HTTP request processing, as well as a middleware function to handle these errors and send standardized JSON responses to the client.
 * @module middleware/errorHandler
 */
import { HTTPCodes, respondWithErrorJson } from "../utils/json.js";

export async function errorHandlingMiddleware(err, req, res, next) {
  if (err instanceof HTTPRequestError) {
    return respondWithErrorJson(
      res,
      err.httpStatusCode,
      err.message,
      err.statusCode,
    );
  }

  if (err?.type === "entity.parse.failed") {
    return respondWithErrorJson(
      res,
      HTTPCodes.BAD_REQUEST,
      "Invalid JSON payload",
      StatusCodes.BAD_REQUEST,
    );
  }
  console.log("Unexpected Error!", err.stack);
  return respondWithErrorJson(
    res,
    HTTPCodes.INTERNAL_SERVER_ERROR,
    "An unexpected error occurred",
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
}

/**
 * @function StatusCodes
 * @description Standardized status codes for various error conditions in the application. These are used in conjunction with the custom error classes to provide consistent error handling and responses across the application.
 * @constant
 * @type {{LOGIN_FAILURE: string, LOGIN_FAILURE_MFA_REQUIRED: string, LOGIN_FAILURE_ACCOUNT_LOCKED: string, LOGIN_FAILURE_ACCOUNT_NOT_SETUP: string, UNAUTHORIZED: string, BAD_REQUEST: string, FORBIDDEN: string, INTERNAL_SERVER_ERROR: string, NOT_FOUND: string, RUN_TIME_ERROR: string}}
 */
export const StatusCodes = {
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGIN_FAILURE_MFA_REQUIRED: "LOGIN_FAILURE_MFA_REQUIRED",
  LOGIN_FAILURE_ACCOUNT_LOCKED: "LOGIN_FAILURE_ACCOUNT_LOCKED",
  LOGIN_FAILURE_ACCOUNT_NOT_SETUP: "LOGIN_FAILURE_ACCOUNT_NOT_SETUP",
  UNAUTHORIZED: "UNAUTHORIZED",
  BAD_REQUEST: "BAD_REQUEST",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  NOT_FOUND: "NOT_FOUND",
  RUN_TIME_ERROR: "RUN_TIME_ERROR",
};

/**
 * @function AppError
 * @description Base class for application-specific errors. Extends the built-in Error class and includes additional properties such as statusCode and timestamp for better error tracking and handling.
 * @class
 * @extends Error
 * @param {string} name - The name of the error type.
 * @param {string} message - A descriptive error message.
 * @param {string} statusCode - A standardized status code representing the error condition.
 */
class AppError extends Error {
  constructor(name, message, statusCode) {
    super(message);
    this.message = message;
    this.name = name;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * @function HTTPRequestError
 * @description Base class for errors that occur during HTTP request processing. Extends AppError and includes additional properties to capture relevant request information such as IP address, user agent, HTTP method, URL, headers, and body. This allows for more detailed error logging and debugging.
 * @class
 * @extends AppError
 * @param {Request} req - The Express request object associated with the error.
 * @param {string} name - The name of the error type.
 * @param {string} message - A descriptive error message.
 * @param {string} statusCode - A standardized status code representing the error condition.
 * @param {number} httpStatusCode - The HTTP status code to be sent in the response.
 * @param {boolean} sanitise - If true, sensitive request information (method, URL, headers, body) will not be captured to avoid logging sensitive data.
 */
class HTTPRequestError extends AppError {
  constructor(req, name, message, statusCode, httpStatusCode, sanitise) {
    super(name, message, statusCode);
    this.ip = req?.ip || req?.socket?.remoteAddress || "Unknown IP";
    this.user_agent = req?.headers["user-agent"] || "Unknown User Agent";
    this.httpStatusCode = httpStatusCode;
    if (!sanitise) {
      this.method = req?.method || "Unknown Method";
      this.url = req?.url || "Unknown URL";
      this.headers = req?.headers || "Unknown Headers";
      this.body = req?.body || "Unknown Body";
    }
  }
}

/**
 * @function BadRequestError
 * @description Represents a 400 Bad Request error condition. This error is typically thrown when the client sends a request that is malformed or contains invalid data. It extends HTTPRequestError and sets the appropriate status codes for consistent error handling and responses.
 * @class
 * @extends HTTPRequestError
 * @param {Request} req - The Express request object associated with the error.
 * @param {string} message - A descriptive error message explaining the reason for the bad request.
 * @param {string} statusCode - A standardized status code representing the specific bad request condition.
 * @param {boolean} sanitise - If true, sensitive request information will not be captured in the error object.
 */
export class BadRequestError extends HTTPRequestError {
  constructor(
    req,
    message,
    statusCode = StatusCodes.BAD_REQUEST,
    sanitise = false,
  ) {
    super(
      req,
      "BadRequestError",
      message,
      statusCode,
      HTTPCodes.BAD_REQUEST,
      sanitise,
    );
  }
}

/**
 * @function UnauthorizedError
 * @description Represents a 401 Unauthorized error condition. This error is typically thrown when the client fails to provide valid authentication credentials or does not have permission to access the requested resource. It extends HTTPRequestError and sets the appropriate status codes for consistent error handling and responses.
 * @class
 * @extends HTTPRequestError
 * @param {Request} req - The Express request object associated with the error.
 * @param {string} message - A descriptive error message explaining the reason for the unauthorized access.
 * @param {string} statusCode - A standardized status code representing the specific unauthorized condition.
 * @param {boolean} sanitise - If true, sensitive request information will not be captured in the error object.
 */
export class UnauthorizedError extends HTTPRequestError {
  constructor(
    req,
    message,
    statusCode = StatusCodes.UNAUTHORIZED,
    sanitise = false,
  ) {
    super(
      req,
      "UnauthorizedError",
      message,
      statusCode,
      HTTPCodes.UNAUTHORIZED,
      sanitise,
    );
  }
}

/**
 * @function ForbiddenError
 * @description Represents a 403 Forbidden error condition. This error is typically thrown when the client is authenticated but does not have permission to access the requested resource. It extends HTTPRequestError and sets the appropriate status codes for consistent error handling and responses.
 * @class
 * @extends HTTPRequestError
 * @param {Request} req - The Express request object associated with the error.
 * @param {string} message - A descriptive error message explaining the reason for the forbidden access.
 * @param {string} statusCode - A standardized status code representing the specific forbidden condition.
 * @param {boolean} sanitise - If true, sensitive request information will not be captured in the error object.
 */
export class ForbiddenError extends HTTPRequestError {
  constructor(
    req,
    message,
    statusCode = StatusCodes.FORBIDDEN,
    sanitise = false,
  ) {
    super(
      req,
      "ForbiddenError",
      message,
      statusCode,
      HTTPCodes.FORBIDDEN,
      sanitise,
    );
  }
}

/**
 * @function NotFoundError
 * @description Represents a 404 Not Found error condition. This error is typically thrown when the client requests a resource that does not exist on the server. It extends HTTPRequestError and sets the appropriate status codes for consistent error handling and responses.
 * @class
 * @extends HTTPRequestError
 * @param {Request} req - The Express request object associated with the error.
 * @param {string} message - A descriptive error message explaining the reason for the not found condition.
 * @param {string} statusCode - A standardized status code representing the specific not found condition.
 * @param {boolean} sanitise - If true, sensitive request information will not be captured in the error object.
 */
export class NotFoundError extends HTTPRequestError {
  constructor(
    req,
    message,
    statusCode = StatusCodes.NOT_FOUND,
    sanitise = false,
  ) {
    super(
      req,
      "NotFoundError",
      message,
      statusCode,
      HTTPCodes.NOT_FOUND,
      sanitise,
    );
  }
}

/**
 * @function InternalServerError
 * @description Represents a 500 Internal Server Error condition. This error is typically thrown when an unexpected condition occurs on the server that prevents it from fulfilling the request. It extends HTTPRequestError and sets the appropriate status codes for consistent error handling and responses.
 * @class
 * @extends HTTPRequestError
 * @param {Request} req - The Express request object associated with the error.
 * @param {string} message - A descriptive error message explaining the reason for the internal server error.
 * @param {string} statusCode - A standardized status code representing the specific internal server error condition.
 * @param {boolean} sanitise - If true, sensitive request information will not be captured in the error object.
 */
export class InternalServerError extends HTTPRequestError {
  constructor(
    req,
    message,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    sanitise = false,
  ) {
    super(
      req,
      "InternalServerError",
      message,
      statusCode,
      HTTPCodes.INTERNAL_SERVER_ERROR,
      sanitise,
    );
  }
}

/**
 * @function RunTimeError
 * @description Represents a runtime error condition that occurs during the execution of the application. This error is typically thrown when an unexpected condition occurs that is not directly related to an HTTP request, such as a failure in a background job or an unhandled exception in the code. It extends AppError and sets the appropriate status code for consistent error handling and responses.
 * @class
 * @extends AppError
 * @param {string} message - A descriptive error message explaining the reason for the runtime error.
 * @param {Error} error - The original error object that caused the runtime error, used to capture the stack trace for debugging purposes.
 */
export class RunTimeError extends AppError {
  constructor(message, error) {
    super("RunTimeError", message, StatusCodes.RUN_TIME_ERROR);
    this.stack = error?.stack || "No stack trace available";
  }
}
