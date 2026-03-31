import FaultReport from "./faultReport";
import User from "./users";

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
