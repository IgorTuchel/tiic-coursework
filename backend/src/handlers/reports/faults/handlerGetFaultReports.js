import { getUserRoleByID } from "../../../services/cacheDb.js";
import {
  ForbiddenError,
  NotFoundError,
} from "../../../middleware/errorHandler.js";
import FaultReport from "../../../models/appdb/faultReport.js";
import User from "../../../models/appdb/users.js";
import { Op, fn, col } from "sequelize";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import { userAssignedToFaultReport } from "../../../services/workOnReport.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";
import SeverityLevel from "../../../models/appdb/severityLevel.js";
import ReportStatus from "../../../models/appdb/reportStatus.js";

const faultReportIncludes = () => [
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
    as: "createdByUser",
    attributes: ["userID", "firstName", "lastName", "email"],
    required: false,
  },
  {
    model: User,
    as: "assignedUsers",
    attributes: ["userID", "firstName", "email"],
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
        attributes: ["userID", "firstName", "email"],
      },
    ],
    required: false,
  },
];

export async function handlerGetFaultReports(req, res) {
  const requestedUserRole = await getUserRoleByID(req.session.roleID);
  if (!requestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  const isPrivileged =
    requestedUserRole.data.isAdmin || requestedUserRole.data.canManageFaults;

  const queryOptions = isPrivileged
    ? {
        include: faultReportIncludes(),
        distinct: true,
        limit,
        offset,
      }
    : {
        where: {
          [Op.or]: [
            { createdBy: req.session.userID },
            { "$assignedUsers.userID$": req.session.userID },
          ],
        },
        include: faultReportIncludes(),
        distinct: true,
        subQuery: false,
        limit,
        offset,
      };

  const { count, rows: faultReports } =
    await FaultReport.findAndCountAll(queryOptions);

  const totalPages = Math.ceil(count / limit);

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: faultReports,
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

export async function handlerGetFaultReportByID(req, res) {
  const { id } = req.params;
  const requestedUserRole = await getUserRoleByID(req.session.roleID);

  if (!requestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  const faultReport = await FaultReport.findOne({
    where: { faultReportID: id },
    include: faultReportIncludes(),
  });

  if (!faultReport) {
    throw new NotFoundError(req, "Fault report not found");
  }

  if (
    !(await userAssignedToFaultReport(req.session.userID, id)) &&
    faultReport.createdBy !== req.session.userID &&
    !requestedUserRole.data.isAdmin &&
    !requestedUserRole.data.canManageFaults
  ) {
    throw new NotFoundError(req, "Fault report not found");
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: faultReport,
  });
}

export async function handlerGetMyOpenFaultReports(req, res) {
  const userID = req.session.userID;

  const { count, rows: faultReports } = await FaultReport.findAndCountAll({
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
    include: faultReportIncludes(),
    distinct: true,
    subQuery: false,
  });

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: faultReports,
    total: count,
  });
}

export async function handlerGetFaultReportCount(req, res) {
  const userID = req.session.userID;

  const count = await FaultReport.count({
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
    col: "faultReportID",
    subQuery: false,
  });

  const countClosed = await FaultReport.count({
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
    col: "faultReportID",
    subQuery: false,
  });

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: { openFaultReportCount: count, closedFaultReportCount: countClosed },
  });
}

export async function handlerGetAllFaultReportCount(req, res) {
  const userID = req.session.userID;
  const requestedUserRole = await getUserRoleByID(req.session.roleID);

  if (!requestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  const isPrivileged =
    requestedUserRole.data.isAdmin ||
    requestedUserRole.data.canManageFaults ||
    requestedUserRole.data.canViewAllReports ||
    requestedUserRole.data.canManageFaults ||
    requestedUserRole.data.canViewAllFaults;

  if (!isPrivileged) {
    throw new ForbiddenError(
      req,
      "You do not have permission to view this data",
    );
  }

  const count = await FaultReport.count({
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
    col: "faultReportID",
  });

  const countClosed = await FaultReport.count({
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
    col: "faultReportID",
  });

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: { openFaultReportCount: count, closedFaultReportCount: countClosed },
  });
}
