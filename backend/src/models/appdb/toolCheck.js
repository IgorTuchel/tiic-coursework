import { db } from "../../config/db.js";
import { Sequelize } from "sequelize";

const ToolCheck = db.define("ToolCheck", {
  toolID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

ToolCheck.afterSync(async () => {
  await ToolCheck.findOrCreate({
    where: { name: "screwdriver" },
  });
  await ToolCheck.findOrCreate({
    where: { name: "metal_nut" },
  });
  await ToolCheck.findOrCreate({
    where: { name: "tape_measure" },
  });
});

export default ToolCheck;
