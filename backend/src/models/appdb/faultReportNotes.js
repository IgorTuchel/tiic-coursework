import { db } from "../../config/db";
import ReportNotes from "./reportNotes";

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
