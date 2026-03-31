import { db } from "../../config/db";
import ReportStatus from "./reportStatus";
import SeverityLevel from "./severityLevel";
import User from "./users";

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
