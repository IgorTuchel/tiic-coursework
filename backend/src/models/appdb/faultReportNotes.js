import { db } from "../../config/db.js";
import ReportNotes from "./reportNotes.js";
import { Sequelize } from "sequelize";

const faultReportNotes = db.define("FaultReportNotes", {
  faultReportID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: faultReportID,
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

export default faultReportNotes;
