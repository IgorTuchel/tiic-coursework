import { db } from "../../config/db";

const ToolCheck = db.define("ToolCheck", {
  toolID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

ToolCheck.afterSync(async () => {
  await ToolCheck.bulkCreate(
    [{ name: "Screwdriver" }, { name: "Metal Nut" }, { name: "Tape Measure" }],
    { ignoreDuplicates: true },
  );
});

export default ToolCheck;
