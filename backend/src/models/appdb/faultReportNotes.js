import { db } from "../../config/db.js";
import ReportNotes from "./reportNotes.js";
import { Sequelize } from "sequelize";
import FaultReport from "./faultReport.js";

const FaultReportNotes = db.define("FaultReportNotes", {
  faultReportID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: FaultReport,
      key: "faultReportID",
    },
  },
  reportNoteID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: ReportNotes,
      key: "reportNoteID",
    },
  },
});

FaultReport.belongsToMany(ReportNotes, {
  through: FaultReportNotes,
  as: "notes",
  foreignKey: "faultReportID",
  otherKey: "reportNoteID",
});

ReportNotes.belongsToMany(FaultReport, {
  through: FaultReportNotes,
  as: "faultReports",
  foreignKey: "reportNoteID",
  otherKey: "faultReportID",
});

export default FaultReportNotes;
