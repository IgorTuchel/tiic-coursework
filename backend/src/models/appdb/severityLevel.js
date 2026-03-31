import { db } from "../../config/db.js";
import { Sequelize } from "sequelize";

const SeverityLevel = db.define("SeverityLevel", {
  severityLevelID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  severityLevelName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

SeverityLevel.afterSync(async () => {
  await SeverityLevel.bulkCreate(
    [
      { severityLevelName: "low" },
      { severityLevelName: "medium" },
      { severityLevelName: "high" },
      { severityLevelName: "critical" },
    ],
    { ignoreDuplicates: true },
  );
});

export default SeverityLevel;
