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
  reportStatusID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: ReportStatus,
      key: "reportStatusID",
    },
  },
  severityLevelID: {
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

FaultReport.belongsTo(User, {
  as: "createdByUser",
  foreignKey: "createdBy",
});
FaultReport.belongsTo(ReportStatus, {
  as: "reportStatus",
  foreignKey: "reportStatusID",
});
FaultReport.belongsTo(SeverityLevel, {
  as: "severityLevel",
  foreignKey: "severityLevelID",
});

export default FaultReport;
