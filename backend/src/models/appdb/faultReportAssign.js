import FaultReport from "./faultReport.js";
import User from "./users.js";
import { Sequelize } from "sequelize";
import { db } from "../../config/db.js";

const FaultReportAssign = db.define("FaultReportAssign", {
  userID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "userID",
    },
  },
  faultReportID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: FaultReport,
      key: "faultReportID",
    },
  },
});

export default FaultReportAssign;
