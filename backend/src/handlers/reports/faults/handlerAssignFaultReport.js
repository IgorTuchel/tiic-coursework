import { BadRequestError } from "../../../middleware/errorHandler.js";
import FaultReport from "../../../models/appdb/faultReport.js";
import { getUserByID } from "../../../services/cacheDb.js";
import {
  assignUserToFaultReport,
  unassignUserFromFaultReport,
} from "../../../services/workOnReport.js";
import { HTTPCodes, respondWithJson } from "../../../utils/json.js";

export async function handlerAssignFaultReport(req, res) {
  const { id } = req.params;
  const { userID } = req.body;

  const user = await getUserByID(userID);
  if (!user.success) {
    throw new BadRequestError(req, "User not found");
  }

  const faultReport = await FaultReport.findOne({
    where: { faultReportID: id },
  });
  if (!faultReport) {
    throw new BadRequestError(req, "Fault report not found");
  }

  const assigned = await assignUserToFaultReport(userID, id);
  if (!assigned.success) {
    throw new BadRequestError(req, assigned.message);
  }

  respondWithJson(res, HTTPCodes.CREATED, {
    success: true,
    message: "User assigned to fault report successfully",
  });
}

export async function handlerUnassignFaultReport(req, res) {
  const { id } = req.params;
  const { userID } = req.body;

  const user = await getUserByID(userID);
  if (!user.success) {
    throw new BadRequestError(req, "User not found");
  }

  const faultReport = await FaultReport.findOne({
    where: { faultReportID: id },
  });
  if (!faultReport) {
    throw new BadRequestError(req, "Fault report not found");
  }

  const unassign = await unassignUserFromFaultReport(userID, id);
  if (!unassign.success) {
    throw new BadRequestError(req, unassign.message);
  }

  respondWithJson(res, HTTPCodes.OK, {
    success: true,
    message: "User unassigned from fault report successfully",
  });
}
