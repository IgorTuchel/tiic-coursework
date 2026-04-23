import { respondWithJson } from "../../../utils/json.js";
import { HTTPCodes } from "../../../utils/json.js";
import {
  BadRequestError,
  InternalServerError,
} from "../../../middleware/errorHandler.js";
import FaultReport from "../../../models/appdb/faultReport.js";
import {
  getReportStatuses,
  getSeverityLevelByID,
} from "../../../services/cacheDb.js";

export async function handlerCreateFaultReport(req, res) {
  const { name, description, severity } = req.body;

  if (!name || !description || !severity) {
    throw new BadRequestError(req, "Missing required fields");
  }

  const reportStatus = await getReportStatuses()
    .then((res) => {
      if (!res.success) {
        throw new InternalServerError(
          req,
          "Failed to retrieve report statuses",
        );
      }
      return res.data.find((status) => status.statusName === "open");
    })
    .catch((err) => {
      throw new InternalServerError(req, "Failed to retrieve report statuses");
    });

  const severityLevel = await getSeverityLevelByID(severity);
  if (!severityLevel.success) {
    throw new BadRequestError(req, "Invalid severity level provided");
  }

  const newFaultReport = await FaultReport.create({
    name,
    description,
    reportStatusID: reportStatus.reportStatusID,
    severityLevelID: severityLevel.data.severityLevelID,
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
      reportStatusID: reportStatus.reportStatusID,
      severityLevelID: severityLevel.data.severityLevelID,
      createdBy: req.session.userID,
    },
  });
}
