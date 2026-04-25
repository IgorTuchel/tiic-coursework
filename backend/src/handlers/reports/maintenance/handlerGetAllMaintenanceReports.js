import User from "../../../models/appdb/users.js";
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";
import {
  ForbiddenError,
  NotFoundError,
} from "../../../middleware/errorHandler.js";
import ToolCheck from "../../../models/appdb/toolCheck.js";
import { getUserRoleByID } from "../../../services/cacheDb.js";
import { Op } from "sequelize";
import SeverityLevel from "../../../models/appdb/severityLevel.js";
import ReportStatus from "../../../models/appdb/reportStatus.js";

const reportIncludes = () => [
  {
    model: User,
    as: "createdByUser",
    attributes: ["userID", "firstName", "lastName", "email"],
    required: false,
  },
  {
    model: SeverityLevel,
    as: "severityLevel",
    attributes: ["severityLevelID", "severityLevelName"],
    required: false,
  },
  {
    model: ReportStatus,
    as: "reportStatus",
    attributes: ["reportStatusID", "statusName"],
    required: false,
  },
  {
    model: User,
    as: "assignedUsers",
    attributes: ["userID", "firstName", "lastName", "email"],
    through: { attributes: [] },
    required: false,
  },
  {
    model: ReportNotes,
    as: "notes",
    through: { attributes: [] },
    attributes: ["reportNoteID", "title", "content", "createdAt", "updatedAt"],
    include: [
      {
        model: User,
        as: "createdByUser",
        attributes: ["userID", "firstName", "lastName", "email"],
      },
    ],
    required: false,
  },
  {
    model: ToolCheck,
    as: "toolChecks",
    attributes: ["toolID", "name"],
    through: { attributes: [] },
    required: false,
  },
];

export async function handlerGetAllMaintenanceReports(req, res) {
  const requrestedUserRole = await getUserRoleByID(req.session.roleID);
  const userID = req.session.userID;

  if (!requrestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  const isPrivileged =
    requrestedUserRole.data.isAdmin ||
    requrestedUserRole.data.canManageReports ||
    requrestedUserRole.data.canViewAllReports;

  const queryOptions = isPrivileged
    ? {
        include: reportIncludes(),
        distinct: true,
        limit,
        offset,
      }
    : {
        where: {
          [Op.or]: [
            { createdBy: userID },
            { "$assignedUsers.userID$": userID },
          ],
        },
        include: reportIncludes(),
        subQuery: false,
        distinct: true,
        limit,
        offset,
      };

  const { count, rows: maintenanceReports } =
    await MaintenanceReport.findAndCountAll(queryOptions);

  const totalPages = Math.ceil(count / limit);

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: maintenanceReports,
    pagination: {
      total: count,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}

export async function handlerGetMyOpenMaintenanceReports(req, res) {
  const userID = req.session.userID;

  const { count, rows: maintenanceReports } =
    await MaintenanceReport.findAndCountAll({
      where: {
        [Op.or]: [{ createdBy: userID }, { "$assignedUsers.userID$": userID }],
        [Op.and]: [
          {
            "$reportStatus.statusName$": {
              [Op.ne]: "closed",
            },
          },
        ],
      },
      subQuery: false,
      include: reportIncludes(),
      distinct: true,
    });

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: maintenanceReports,
    total: count,
  });
}

export async function handlerGetMaintenanceReportCount(req, res) {
  const userID = req.session.userID;

  const count = await MaintenanceReport.count({
    where: {
      [Op.or]: [{ createdBy: userID }, { "$assignedUsers.userID$": userID }],
    },
    include: [
      {
        model: ReportStatus,
        as: "reportStatus",
        where: { statusName: { [Op.ne]: "closed" } },
        attributes: [],
        required: true,
      },
      {
        model: User,
        as: "assignedUsers",
        attributes: [],
        through: { attributes: [] },
        required: false,
      },
    ],
    distinct: true,
    subQuery: false,
    col: "maintenanceReportID",
  });

  const countClosed = await MaintenanceReport.count({
    where: {
      [Op.or]: [{ createdBy: userID }, { "$assignedUsers.userID$": userID }],
    },
    include: [
      {
        model: ReportStatus,
        as: "reportStatus",
        where: { statusName: { [Op.eq]: "closed" } },
        attributes: [],
        required: true,
      },
      {
        model: User,
        as: "assignedUsers",
        attributes: [],
        through: { attributes: [] },
        required: false,
      },
    ],
    distinct: true,
    subQuery: false,
    col: "maintenanceReportID",
  });
  console.log("Open count:", count);
  console.log("Closed count:", countClosed);
  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: {
      openMaintenanceReportCount: count,
      closedMaintenanceReportCount: countClosed,
    },
  });
}

export async function handlerGetAllMaintenanceReportCount(req, res) {
  const userID = req.session.userID;
  const requestedUserRole = await getUserRoleByID(req.session.roleID);

  if (!requestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  const isPrivileged =
    requestedUserRole.data.isAdmin ||
    requestedUserRole.data.canManageReports ||
    requestedUserRole.data.canViewAllReports;

  if (!isPrivileged) {
    throw new ForbiddenError(
      req,
      "You do not have permission to view this data",
    );
  }

  const count = await MaintenanceReport.count({
    include: [
      {
        model: ReportStatus,
        as: "reportStatus",
        where: { statusName: { [Op.ne]: "closed" } },
        attributes: [],
        required: true,
      },
      {
        model: User,
        as: "assignedUsers",
        attributes: [],
        through: { attributes: [] },
        required: false,
      },
    ],
    distinct: true,
    col: "maintenanceReportID",
  });

  const countClosed = await MaintenanceReport.count({
    include: [
      {
        model: ReportStatus,
        as: "reportStatus",
        where: { statusName: { [Op.eq]: "closed" } },
        attributes: [],
        required: true,
      },
      {
        model: User,
        as: "assignedUsers",
        attributes: [],
        through: { attributes: [] },
        required: false,
      },
    ],
    distinct: true,
    col: "maintenanceReportID",
  });

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: {
      openMaintenanceReportCount: count,
      closedMaintenanceReportCount: countClosed,
    },
  });
}
