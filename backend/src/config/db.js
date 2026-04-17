/**
 * @file db.js
 * @description Database configuration and integrity verification.
 * Defines the Sequelize instances for the main application database and the logging database.
 * @module config/db
 */
import { Sequelize } from "sequelize";

/**
 * The configured Sequelize instance for the main application database.
 * @type {Sequelize}
 * @description Note: The connection is established and verified in the startup orchestrator.
 * @see https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html
 */
const db = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
  logging: false,
});

/**
 * The configured Sequelize instance for the logging database.
 * @type {Sequelize}
 * @description Note: The connection is established and verified in the startup orchestrator.
 * @see https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html
 */
const logDb = new Sequelize({
  dialect: "sqlite",
  storage: "./logs.sqlite",
  logging: false,
});

export { db, logDb };
