import { db } from "../../config/db.js";
import ReportStatus from "./reportStatus.js";
import SeverityLevel from "./severityLevel.js";
import User from "./users.js";
import { Sequelize } from "sequelize"; 

const MaintenanceReport = db.define("MaintenanceReport", {
  maintenanceReportID: {
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
  markerScanBlob: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  createdBy: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "userID",
    },
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
});

export default MaintenanceReport;
