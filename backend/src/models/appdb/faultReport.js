import { db } from "../../config/db.js";
import ReportStatus from "./reportStatus.js";
import SeverityLevel from "./severityLevel.js";
import User from "./users.js";
import { Sequelize } from "sequelize";

const FaultReport = db.define("FaultReport", {
  faultReportID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  reportStatus: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: ReportStatus,
      key: "reportStatusID",
    },
  },
  severityLevel: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: SeverityLevel,
      key: "severityLevelID",
    },
  },
  createdBy: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "userID",
    },
  },
});

export default FaultReport;
