import { db } from "../../config/db.js";
import MaintenanceReport from "./maintenanceReport.js";
import User from "./users.js";
import { Sequelize } from "sequelize";

const MaintenanceReportAssign = db.define("MaintenanceReportAssign", {
  maintenanceReportID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: MaintenanceReport,
      key: "maintenanceReportID",
    },
  },
  userID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "userID",
    },
  },
});

MaintenanceReport.belongsToMany(User, {
  through: MaintenanceReportAssign,
  as: "assignedUsers",
  foreignKey: "maintenanceReportID",
  otherKey: "userID",
});

User.belongsToMany(MaintenanceReport, {
  through: MaintenanceReportAssign,
  as: "assignedMaintenanceReports",
  foreignKey: "userID",
  otherKey: "maintenanceReportID",
});

export default MaintenanceReportAssign;
