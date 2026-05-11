/**
 * @file errorLogDb.js
 * @description Service for logging errors to the database.
 */
import ErrorLog from "../models/auditdb/errorLogs.js";

/**
 * Logs an error to the database.
 * @param {Object} errorData - The error data to log.
 * @param {string} errorData.errorName - The name of the error.
 * @param {string} errorData.statusCode - The status code of the error.
 * @param {number} errorData.httpStatusCode - The HTTP status code of the error.
 * @param {string} errorData.message - The error message.
 * @param {string} errorData.stackTrace - The stack trace of the error.
 * @param {string} errorData.ipAddress - The IP address of the request.
 * @param {string} errorData.userAgent - The user agent of the request.
 * @param {string} errorData.method - The HTTP method of the request.
 * @param {string} errorData.url - The URL of the request.
 * @param {Object} errorData.headers - The headers of the request.
 * @param {Object} errorData.body - The body of the request.
 * @param {string} errorData.userID - The ID of the user who caused the error.
 */
export async function logError({
    errorName,
    statusCode,
    httpStatusCode,
    message,
    stackTrace,
    ipAddress,
    userAgent,
    method,
    url,
    headers,
    body,
    userID,
}) {
    try {
        await ErrorLog.create({
            errorName: errorName || "UnknownError",
            statusCode: statusCode || "UNKNOWN_ERROR",
            httpStatusCode: httpStatusCode ?? null,
            message: message ?? "No message provided",
            stackTrace: stackTrace ?? null,
            ipAddress: ipAddress ?? null,
            userAgent: userAgent ?? null,
            method: method ?? null,
            url: url ?? null,
            headers: headers ?? null,
            body: body ?? null,
            userID: userID ?? null,
        });
    } catch (error) {
        console.error("Error logging error:", error);
    }
}
