import { Sequelize } from "sequelize";
import { db } from "../../config/db.js";
import { Sequelize } from "sequelize";

const Status = db.define("Status", {
  statusID: {
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

Status.afterSync(async () => {
  await Status.bulkCreate(
    [
      { statusName: "active" }, // User can use the app
      { statusName: "pending" }, // User has been registered but awaitng to setup password (cant use app)
      { statusName: "suspended" }, // User has been suspended (Cant use app)
      { statusName: "deactivated" }, // User has been deactivated (Cant use app)
    ],
    { ignoreDuplicates: true },
  );
});

export default Status;
