import { db } from "../../config/db.js";
import ReportNotes from "./reportNotes.js";
import MaintenanceReport from "./maintenanceReport.js";
import { Sequelize } from "sequelize";

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

MaintenanceReport.belongsToMany(ReportNotes, {
  through: maintenanceReportNotes,
  as: "notes",
  foreignKey: "maintenanceReportID",
  otherKey: "reportNoteID",
});

ReportNotes.belongsToMany(MaintenanceReport, {
  through: maintenanceReportNotes,
  as: "maintenanceReports",
  foreignKey: "reportNoteID",
  otherKey: "maintenanceReportID",
});

export default maintenanceReportNotes;
