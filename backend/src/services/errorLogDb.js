import ErrorLog from "../models/auditdb/errorLogs.js";

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
