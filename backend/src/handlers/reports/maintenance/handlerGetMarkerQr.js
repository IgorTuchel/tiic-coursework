import {
  ForbiddenError,
  NotFoundError,
} from "../../../middleware/errorHandler.js";
import MaintenanceReport from "../../../models/appdb/maintenanceReport.js";
import {
  getReportStatusByID,
  getUserRoleByID,
} from "../../../services/cacheDb.js";
import { userAssignedToMaintenanceReport } from "../../../services/workOnReport.js";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";

export async function handlerGetMarkerQr(req, res) {
  const { id } = req.params;

  const report = await MaintenanceReport.findOne({
    where: { maintenanceReportID: id },
  });
  if (!report) {
    throw new NotFoundError(req, "Maintenance report not found");
  }

  const userRole = await getUserRoleByID(req.session.roleID);

  if (!userRole.success) {
    throw new NotFoundError(req, "User role not found");
  }

  if (
    !req.session.isAdmin &&
    !userRole.data.canManageReports &&
    !(await userAssignedToMaintenanceReport(req.session.userID, id))
  ) {
    throw new ForbiddenError(
      req,
      "You do not have permission to view this maintenance report's marker QR code",
    );
  }

  const buffer = await QRCode.toBuffer(id, {
    type: "png",
    errorCorrectionLevel: "H",
    margin: 1,
    width: 1181,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
}

export async function handlerGetMarkerPdf(req, res) {
  const { id } = req.params;

  const report = await MaintenanceReport.findOne({
    where: { maintenanceReportID: id },
  });
  if (!report) throw new NotFoundError(req, "Maintenance report not found");

  const userRole = await getUserRoleByID(req.session.roleID);
  if (!userRole.success) throw new NotFoundError(req, "User role not found");

  if (
    !req.session.isAdmin &&
    !userRole.data.canManageReports &&
    !(await userAssignedToMaintenanceReport(req.session.userID, id))
  ) {
    throw new ForbiddenError(
      req,
      "You do not have permission to download this marker PDF",
    );
  }

  const qrBuffer = await QRCode.toBuffer(id, {
    type: "png",
    errorCorrectionLevel: "H",
    margin: 1,
    width: 1181,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  const doc = new PDFDocument({ size: "A4", margin: 40 });

  const MM_TO_PT = 72 / 25.4;
  const QR_SIZE = 100 * MM_TO_PT; // 283.46pt = exactly 100mm

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="marker-${id}.pdf"`,
  );
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="marker-${id}.pdf"`,
  );

  doc.pipe(res);

  // Title
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("Maintenance Report Marker", { align: "center" });

  doc.moveDown(0.5);

  // Divider
  doc
    .moveTo(40, doc.y)
    .lineTo(doc.page.width - 40, doc.y)
    .strokeColor("#cccccc")
    .lineWidth(1)
    .stroke();

  doc.moveDown(1);

  // Report info
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .text("Report Name: ", { continued: true })
    .font("Helvetica")
    .text(report.name || "N/A");

  doc.moveDown(0.4);

  doc
    .font("Helvetica-Bold")
    .text("Report ID: ", { continued: true })
    .font("Helvetica")
    .text(id);

  doc.moveDown(0.4);

  doc
    .font("Helvetica-Bold")
    .text("Status: ", { continued: true })
    .font("Helvetica")
    .text(
      (await getReportStatusByID(report.reportStatusID)).data.statusName ||
        "N/A",
    );

  doc.moveDown(0.4);

  doc
    .font("Helvetica-Bold")
    .text("Created: ", { continued: true })
    .font("Helvetica")
    .text(
      new Date(report.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );

  doc.moveDown(1.5);

  // Divider
  doc
    .moveTo(40, doc.y)
    .lineTo(doc.page.width - 40, doc.y)
    .strokeColor("#cccccc")
    .lineWidth(1)
    .stroke();

  doc.moveDown(1);

  // QR label
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#666666")
    .text("Scan the QR code below to begin the AR session for this report.", {
      align: "center",
    });

  doc.moveDown(1);

  // QR code — centered, exactly 100mm × 100mm
  const xCenter = (doc.page.width - QR_SIZE) / 2;
  doc.image(qrBuffer, xCenter, doc.y, { width: QR_SIZE, height: QR_SIZE });

  doc.on("end", () => {
    res.end();
  });
  doc.end();
}
