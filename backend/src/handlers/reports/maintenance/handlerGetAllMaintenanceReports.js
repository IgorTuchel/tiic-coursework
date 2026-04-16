import User from "../../../models/appdb/users.js";
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
import ReportNotes from "../../../models/appdb/reportNotes.js";
import { NotFoundError } from "../../../middleware/errorHandler.js";
import MaintenanceReportToolCheck from "../../../models/appdb/maintenanceReportToolCheck.js";
import ToolCheck from "../../../models/appdb/toolCheck.js";
import { getUserRoleByID } from "../../../services/cacheDb.js";
import { Op } from "sequelize";

export async function handlerGetAllMaintenanceReports(req, res) {
  const requrestedUserRole = await getUserRoleByID(req.session.roleID);
  if (!requrestedUserRole.success) {
    throw new NotFoundError(req, "User role not found");
  }
  let maintenanceReports;

  if (
    requrestedUserRole.data.isAdmin ||
    requrestedUserRole.data.canManageReports ||
    requrestedUserRole.data.canViewAllReports
  ) {
    maintenanceReports = await MaintenanceReport.findAll({
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
          through: { attributes: [] },
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
        {
          model: ToolCheck,
          as: "toolChecks",
          attributes: ["toolID", "name"],
          through: { attributes: [] },
          required: false,
        },
      ],
      distinct: true,
    });
  } else {
    maintenanceReports = await MaintenanceReport.findAll({
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
          through: { attributes: [] },
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
        {
          model: ToolCheck,
          as: "toolChecks",
          attributes: ["toolID", "name"],
          through: { attributes: [] },
          required: false,
        },
      ],
      distinct: true,
    });
  }
  if (!maintenanceReports) {
    throw new NotFoundError(req, "No maintenance reports found");
  }
  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: maintenanceReports,
  });
}
