/**
 * @file dbStartup.js
 * @description Database startup and integrity verification logic.
 * This module is responsible for verifying the integrity of both the main application database and the logging database during the application startup process. It ensures that both databases are operational and synchronized before allowing the application to proceed with its normal operations.
 * @module config/dbStartup
 */
import { db, logDb } from "./db.js";
import Roles from "../models/appdb/roles.js";
import Status from "../models/appdb/status.js";
import User from "../models/appdb/users.js";
import "../models/appdb/index.js";
import cfg from "./config.js";
import { hashPassword } from "../utils/hashPassword.js";

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
    console.error("Error during database synchronization:", err);
    return { dbSyncStatus, logDbSyncStatus };
  }
}

/**
 * @async
 * @function registerHooks
 * @description Registers Sequelize hooks to perform actions after database synchronization. Specifically, it ensures that an admin user is created if it does not already exist after the database schema is synchronized.
 * This function should be called during the application startup process before synchronizing the database to ensure that the necessary hooks are in place.
 */
export async function registerHooks() {
  db.addHook("afterBulkSync", async () => {
    const adminRole = await Roles.findOne({ where: { roleName: "Admin" } });
    if (!adminRole) {
      throw new Error("Admin role not found during database initialization");
    }
    const userStatus = await Status.findOne({
      where: { statusName: "active" },
    });
    if (!userStatus) {
      throw new Error("Active status not found during database initialization");
    }
    const [newUser, created] = await User.findOrCreate({
      where: { email: cfg.adminEmail },
      defaults: {
        firstName: "Admin",
        lastName: "User",
        email: cfg.adminEmail,
        passwordHash: await hashPassword("AdminPassword123!"),
        roleID: adminRole.roleID,
        statusID: userStatus.statusID,
        mfaEnabled: false,
      },
    });
    if (created) {
      console.log(
        "Created Admin User:",
        newUser.email,
        " with ID:",
        newUser.userID,
        " and RoleID:",
        newUser.roleID,
        " and StatusID:",
        newUser.statusID,
        " and Password AdminPassword123!",
      );
    }
    const engineerRole = await Roles.findOne({
      where: { roleName: "Engineer" },
    });
    if (!engineerRole) {
      throw new Error("Engineer role not found during database initialization");
    }
    const [newEngineerUser, engineerCreated] = await User.findOrCreate({
      where: { email: cfg.engineerEmail },
      defaults: {
        firstName: "Engineer",
        lastName: "User",
        email: cfg.engineerEmail,
        passwordHash: await hashPassword("Password123!"),
        roleID: engineerRole.roleID,
        statusID: userStatus.statusID,
        mfaEnabled: false,
      },
    });
    if (engineerCreated) {
      console.log(
        "Created Engineer User:",
        newEngineerUser.email,
        " with ID:",
        newEngineerUser.userID,
        " and RoleID:",
        newEngineerUser.roleID,
        " and StatusID:",
        newEngineerUser.statusID,
        " and Password Password123!",
      );
    }
  });
}
