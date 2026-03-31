import { db } from "../../config/db.js";
import ReportNotes from "./reportNotes.js";
import MaintenanceReport from "./maintenanceReport.js";

const maintenanceReportNotes = db.define("MaintenanceReportNotes", {
  reportNoteID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: ReportNotes,
      key: "reportNoteID",
    },
  },
  maintenanceReportID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: MaintenanceReport,
      key: "maintenanceReportID",
    },
  },
});

export default maintenanceReportNotes;
