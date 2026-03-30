import { Sequelize } from "sequelize";
import { db } from "../../config/db.js";
import Roles from "./roles.js";
import Status from "./status.js";

const User = db.define("User", {
  userID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  roleID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: Roles,
      key: "roleID",
    },
  },
  mfaEnabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  statusID: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: Status,
      key: "statusID",
    },
  },
});

export default User;
