/**
 * @file handlerGetFaultReports.js
 * @description Handlers for retrieving fault reports. Includes functions for getting all fault reports, getting a specific fault report by ID, getting open fault reports assigned to the current user, and getting counts of fault reports. Validates user permissions and responds with appropriate data based on the user's role and association with the fault reports.
 * @module handlers/reports/faults/handlerGetFaultReports
 */
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

/**
 * Helper function to define the includes for fault report queries. This includes associations with severity level, report status, the user who created the report, assigned users, and notes linked to the report.
 *
 * @function faultReportIncludes
 * @returns {Array} An array of Sequelize include objects for querying fault reports with their associated data.
 */
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

/**
 * Handler for retrieving fault reports. Validates user permissions and responds with appropriate data based on the user's role and association with the fault reports.
 *
 * @async
 * @function handlerGetFaultReports
 * @param {Object} req - The request object containing query parameters for pagination.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {NotFoundError} Throws an error if the user's role is not found.
 */
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

/**
 * Handler for retrieving a specific fault report by ID. Validates user permissions to ensure they are either the creator, an assigned user, or have appropriate roles to access the fault report. Responds with the details of the fault report if found and accessible.
 *
 * @async
 * @function handlerGetFaultReportByID
 * @param {Object} req - The request object containing the fault report ID in the URL parameters.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {NotFoundError} Throws an error if the user's role is not found, if the fault report is not found, or if the user does not have permission to access the fault report.
 */
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

/**
 * Handler for retrieving open fault reports assigned to the current user. Validates user permissions and responds with a list of open fault reports that the user is either the creator or an assigned user of.
 *
 * @async
 * @function handlerGetMyOpenFaultReports
 * @param {Object} req - The request object containing query parameters for pagination.
 * @param {Object} res - The response object used to send the result of the operation.
 */
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

/**
 * Handler for retrieving counts of fault reports. Provides counts of open and closed fault reports that the current user is either the creator or an assigned user of. Validates user permissions before responding with the counts.
 *
 * @async
 * @function handlerGetFaultReportCount
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the result of the operation.
 */
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

/**
 * Handler for retrieving counts of all fault reports. Provides counts of open and closed fault reports across the system. Validates user permissions to ensure they have the appropriate roles to access this data before responding with the counts.
 *
 * @async
 * @function handlerGetAllFaultReportCount
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {ForbiddenError} Throws an error if the user does not have permission to view this data.
 * @throws {NotFoundError} Throws an error if the user's role is not found.
 */
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
