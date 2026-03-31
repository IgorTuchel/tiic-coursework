import { db } from "../../config/db.js";
import MaintenanceReport from "./maintenanceReport.js";
import User from "./users.js";
import { Sequelize } from "sequelize";

const maintenanceReportAssign = db.define("MaintenanceReportAssign", {
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

export default maintenanceReportAssign;
