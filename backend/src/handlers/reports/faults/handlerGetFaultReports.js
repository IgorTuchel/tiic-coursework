import { getUserRoleByID } from "../../../services/cacheDb.js";
import { NotFoundError } from "../../../middleware/errorHandler.js";
import FaultReport from "../../../models/appdb/faultReport.js";
import User from "../../../models/appdb/users.js";
import { Op } from "sequelize";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import { userAssignedToFaultReport } from "../../../services/workOnReport.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";

export async function handlerGetFaultReports(req, res) {
  const requestedUserRole = await getUserRoleByID(req.session.roleID);
  if (!requestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  let faultReports;
  if (
    requestedUserRole.data.isAdmin ||
    requestedUserRole.data.canManageFaults
  ) {
    faultReports = await FaultReport.findAll({
      include: [
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
          attributes: [
            "reportNoteID",
            "title",
            "content",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: User,
              as: "createdByUser",
              attributes: ["userID", "firstName", "email"],
            },
          ],
          required: false,
        },
      ],
      distinct: true,
    });
  } else {
    faultReports = await FaultReport.findAll({
      where: {
        [Op.or]: [
          { createdBy: req.session.userID },
          { "$assignedUsers.userID$": req.session.userID },
        ],
      },
      include: [
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
          attributes: [
            "reportNoteID",
            "title",
            "content",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: User,
              as: "createdByUser",
              attributes: ["userID", "firstName", "email"],
            },
          ],
          required: false,
        },
      ],
      distinct: true,
    });
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: faultReports,
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
    include: [
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
        attributes: [
          "reportNoteID",
          "title",
          "content",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: User,
            as: "createdByUser",
            attributes: ["userID", "firstName", "email"],
          },
        ],
        required: false,
      },
    ],
  });
  if (!faultReport) {
    throw new NotFoundError(req, "Fault report not found");
  }

  if (
    !userAssignedToFaultReport(req.session.userID, id) &&
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
