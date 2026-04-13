import { getUserRoleByID } from "../../../services/cacheDb.js";
import { NotFoundError } from "../../../middleware/errorHandler.js";
import FaultReport from "../../../models/appdb/faultReport.js";
import User from "../../../models/appdb/users.js";
import { Op } from "sequelize";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";
// Handler 1, get all fault reports, if user can manage faults or other high permission return all reports, otherwise return only reports created by the user or assigned to the user

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
      ],
      distinct: true,
    });
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    data: faultReports,
  });
}

// Handler 2, get a specific fault report by ID
