/**
 * @file db.js
 * @description Database configuration and integrity verification.
 * Defines the Sequelize instances for the main application database and the logging database.
 * Provides a function to verify database connectivity and synchronization during application startup.
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

/**
 * Verifies the integrity of both the main application database and the logging database.
 * @async
 * @function verifyDbIntegrity
 * @returns {Promise<{message: string, successful: boolean, data: object}>} An object containing the verification result.
 * @description This function is designed to be called during the application startup process to ensure both databases are operational and synchronized before proceeding.
 */
export async function verifyDbIntegrity() {
  let { dbStatus, logDbStatus } = await verifyConnections();
  if (!dbStatus || !logDbStatus) {
    return {
      message: "Database connection failed",
      successful: false,
      data: { dbStatus: dbStatus, logDbStatus: logDbStatus },
    };
  }
  let { dbSyncStatus, logDbSyncStatus } = await syncDb();
  if (!dbSyncStatus || !logDbSyncStatus) {
    return {
      message: "Database synchronization failed",
      successful: false,
      data: { dbSyncStatus: dbSyncStatus, logDbSyncStatus: logDbSyncStatus },
    };
  }
  return {
    message: "Database integrity verified",
    successful: true,
    data: {
      dbStatus: dbStatus,
      logDbStatus: logDbStatus,
      dbSyncStatus: dbSyncStatus,
      logDbSyncStatus: logDbSyncStatus,
    },
  };
}

/**
 * Helper function to verify database connections by attempting to authenticate both databases.
 * @async
 * @function verifyConnections
 * @returns {Promise<{dbStatus: boolean, logDbStatus: boolean}>} An object indicating the connection status of both databases.
 */
async function verifyConnections() {
  let logDbStatus = false;
  let dbStatus = false;
  try {
    await db.authenticate();
    dbStatus = true;
    await logDb.authenticate();
    logDbStatus = true;
    return { dbStatus, logDbStatus };
  } catch (err) {
    return { dbStatus, logDbStatus };
  }
}

/**
 * Helper function to synchronize both databases by calling the sync method on each Sequelize instance.
 * @async
 * @function syncDb
 * @returns {Promise<{dbSyncStatus: boolean, logDbSyncStatus: boolean}>} An object indicating the synchronization status of both databases.
 */
async function syncDb() {
  let logDbSyncStatus = false;
  let dbSyncStatus = false;
  try {
    await db.sync();
    dbSyncStatus = true;
    await logDb.sync();
    logDbSyncStatus = true;
    return { dbSyncStatus, logDbSyncStatus };
  } catch (err) {
    return { dbSyncStatus, logDbSyncStatus };
  }
}

export { db, logDb };
