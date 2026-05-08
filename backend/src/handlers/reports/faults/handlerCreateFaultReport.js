/**
 * @file handlerCreateFaultReport.js
 * @description Handler for creating new fault reports. Validates the input data, retrieves necessary reference data (report statuses and severity levels), and creates a new fault report in the database. Responds with the details of the newly created fault report upon success.
 * @module handlers/reports/faults/handlerCreateFaultReport
 */
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

/**
 * Handler for creating a new fault report. Validates the input data, retrieves necessary reference data (report statuses and severity levels), and creates a new fault report in the database. Responds with the details of the newly created fault report upon success.
 *
 * @async
 * @function handlerCreateFaultReport
 * @param {Object} req - The request object containing the fault report details in the request body.
 * @param {Object} res - The response object used to send the result of the operation.
 * @throws {BadRequestError} Throws an error if required fields are missing or if invalid severity level is provided.
 * @throws {InternalServerError} Throws an error if there is a failure in retrieving reference data or creating the fault report.
 */
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
