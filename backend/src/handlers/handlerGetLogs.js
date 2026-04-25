import ErrorLog from "../models/auditdb/errorLogs.js";
import { Op } from "sequelize";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

function isValidDate(str) {
  return str && !isNaN(new Date(str).getTime());
}

export async function handlerGetErrorLogs(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  const where = {};

  if (req.query.errorName) where.errorName = req.query.errorName;
  if (req.query.statusCode) where.statusCode = req.query.statusCode;
  if (req.query.httpStatusCode)
    where.httpStatusCode = parseInt(req.query.httpStatusCode);
  if (req.query.method) where.method = req.query.method.toUpperCase();
  if (req.query.userID) where.userID = req.query.userID;
  if (req.query.ipAddress) where.ipAddress = req.query.ipAddress;

  if (req.query.from || req.query.to) {
    where.timestamp = {};

    if (req.query.from && isValidDate(req.query.from)) {
      where.timestamp[Op.gte] = new Date(`${req.query.from}T00:00:00.000Z`);
    }

    if (req.query.to && isValidDate(req.query.to)) {
      where.timestamp[Op.lte] = new Date(`${req.query.to}T23:59:59.999Z`);
    }
  }

  if (req.query.httpStatusRange) {
    const ranges = { "4xx": [400, 499], "5xx": [500, 599], "3xx": [300, 399] };
    const [min, max] = ranges[req.query.httpStatusRange] ?? [];
    if (min !== undefined) {
      where.httpStatusCode = { [Op.between]: [min, max] };
    }
  }

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
        hasNextPage: page < Math.ceil(count / limit),
        hasPrevPage: page > 1,
      },
    },
  });
}
