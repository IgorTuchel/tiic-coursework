import { db } from "../../config/db.js";
import User from "./users.js";
import { Sequelize } from "sequelize";

const ReportNotes = db.define("ReportNotes", {
  reportNoteID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "userID",
    },
  },
});

export default ReportNotes;
