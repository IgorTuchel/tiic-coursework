import ReportStatus from "../../../models/appdb/reportStatus.js";
import { respondWithJson, HTTPCodes } from "../../../utils/json.js";

export async function handlerGetReportStatuses(req, res) {
  const reportStatuses = await ReportStatus.findAll({
    attributes: ["reportStatusID", "statusName"],
  });

  if (!reportStatuses) {
    throw new InternalServerError(req, "Failed to retrieve report statuses");
  }

  respondWithJson(res, HTTPCodes.OK, { success: true, data: reportStatuses });
}
