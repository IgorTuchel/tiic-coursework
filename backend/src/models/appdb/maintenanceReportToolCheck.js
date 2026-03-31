import MaintenanceReport from "./maintenanceReport";
import ToolCheck from "./toolCheck";
import { db } from "../../config/db";

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

export default MaintenanceReportToolCheck;
