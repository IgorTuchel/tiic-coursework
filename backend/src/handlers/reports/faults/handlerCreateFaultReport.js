import ReportStatus from "../../../models/appdb/reportStatus.js";
import SeverityLevel from "../../../models/appdb/severityLevel.js";
import { respondWithJson } from "../../../utils/json.js";
import { HTTPCodes } from "../../../utils/json.js";
import {
  BadRequestError,
  InternalServerError,
} from "../../../middleware/errorHandler.js";
import FaultReport from "../../../models/appdb/faultReport.js";

export async function handlerCreateFaultReport(req, res) {
  const { name, description, severity } = req.body;

  if (!name || !description || !severity) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const reportStatus = await ReportStatus.findOne({
    where: { statusName: "open" },
  });
  if (!reportStatus) {
    throw new InternalServerError(
      req,
      "Open report status not found in database",
    );
  }

  const severityLevel = await SeverityLevel.findOne({
    where: { levelName: severity },
  });
  if (!severityLevel) {
    throw new BadRequestError(req, "Invalid severity level provided");
  }

  const newFaultReport = await FaultReport.create({
    name,
    description,
    reportStatus: reportStatus.reportStatusID,
    severityLevel: severityLevel.severityLevelID,
    createdBy: req.session.userID,
  });

  if (!newFaultReport) {
    throw new InternalServerError(req, "Failed to create fault report");
  }

  respondWithJson(res, HTTPCodes.CREATED, {
    data: {
      faultReportID: newFaultReport.faultReportID,
      name: newFaultReport.name,
      description: newFaultReport.description,
      reportStatus: reportStatus.statusName,
      severityLevel: severityLevel.levelName,
      createdBy: req.session.userID,
    },
  });
}
