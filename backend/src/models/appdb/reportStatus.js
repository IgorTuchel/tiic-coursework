import { db } from "../../config/db.js";
import { Sequelize } from "sequelize";

const ReportStatus = db.define("ReportStatus", {
  reportStatusID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  statusName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

ReportStatus.afterSync(async () => {
  await ReportStatus.bulkCreate(
    [
      { statusName: "open" },
      { statusName: "in_progress" },
      { statusName: "resolved" },
      { statusName: "closed" },
    ],
    { ignoreDuplicates: true },
  );
});

export default ReportStatus;
