import { logDb } from "../../config/db.js";

const ErrorLog = logDb.define("ErrorLog", {
  errorID: {
    type: logDb.Sequelize.UUID,
    defaultValue: logDb.Sequelize.UUIDV4,
    primaryKey: true,
  },
  timestamp: {
    type: logDb.Sequelize.DATE,
    allowNull: false,
    defaultValue: logDb.Sequelize.NOW,
  },
  errorName: {
    type: logDb.Sequelize.STRING,
    allowNull: false,
  },
  statusCode: {
    type: logDb.Sequelize.STRING,
    allowNull: false,
  },
  httpStatusCode: {
    type: logDb.Sequelize.INTEGER,
    allowNull: true,
  },
  message: {
    type: logDb.Sequelize.TEXT,
    allowNull: false,
  },
  stackTrace: {
    type: logDb.Sequelize.TEXT,
    allowNull: true,
  },
  ipAddress: {
    type: logDb.Sequelize.STRING,
    allowNull: true,
  },
  userAgent: {
    type: logDb.Sequelize.TEXT,
    allowNull: true,
  },
  method: {
    type: logDb.Sequelize.STRING,
    allowNull: true,
  },
  url: {
    type: logDb.Sequelize.TEXT,
    allowNull: true,
  },
  headers: {
    type: logDb.Sequelize.JSON,
    allowNull: true,
  },
  body: {
    type: logDb.Sequelize.JSON,
    allowNull: true,
  },
  userID: {
    type: logDb.Sequelize.UUID,
    allowNull: true,
  },
});

export default ErrorLog;
