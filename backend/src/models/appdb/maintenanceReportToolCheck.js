import MaintenanceReport from "./maintenanceReport.js";
import ToolCheck from "./toolCheck.js";
import { db } from "../../config/db.js";
import { Sequelize } from "sequelize";

const MaintenanceReportToolCheck = db.define("MaintenanceReportToolCheck", {
  maintenanceReportID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: MaintenanceReport,
      key: "maintenanceReportID",
    },
  },
  toolID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: ToolCheck,
      key: "toolID",
    },
  },
});

MaintenanceReport.belongsToMany(ToolCheck, {
  through: MaintenanceReportToolCheck,
  as: "toolChecks",
  foreignKey: "maintenanceReportID",
  otherKey: "toolID",
});

ToolCheck.belongsToMany(MaintenanceReport, {
  through: MaintenanceReportToolCheck,
  as: "maintenanceReports",
  foreignKey: "toolID",
  otherKey: "maintenanceReportID",
});

export default MaintenanceReportToolCheck;
