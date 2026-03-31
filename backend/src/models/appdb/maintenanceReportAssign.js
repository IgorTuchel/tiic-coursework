import { db } from "../../config/db";
import MaintenanceReport from "./maintenanceReport";
import User from "./users";

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
