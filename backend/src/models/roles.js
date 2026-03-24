import { Sequelize } from "sequelize";
import { db } from "../config/db.js";

const Roles = db.define("Roles", {
  roleID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  roleName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  accessLevel: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  mfaRequired: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default Roles;
