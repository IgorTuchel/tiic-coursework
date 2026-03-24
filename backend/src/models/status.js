import { Sequelize } from "sequelize";
import { db } from "../config/db.js";

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

export default Status;
