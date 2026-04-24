import ErrorLog from "../models/auditdb/errorLogs.js";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import { BadRequestError } from "../middleware/errorHandler.js";

export async function handlerGetErrorLogs(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  const where = {};
  if (req.query.errorName) where.errorName = req.query.errorName;
  if (req.query.httpStatusCode)
    where.httpStatusCode = parseInt(req.query.httpStatusCode);
  if (req.query.statusCode) where.statusCode = req.query.statusCode;
  if (req.query.userID) where.userID = req.query.userID;

  const { count, rows } = await ErrorLog.findAndCountAll({
    where,
    order: [["timestamp", "DESC"]],
    limit,
    offset,
  });

  return respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: {
      logs: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1,
      },
    },
  });
}
