import { Sequelize } from "sequelize";

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
  logging: false,
});

const logDb = new Sequelize({
  dialect: "sqlite",
  storage: "./logs.sqlite",
  logging: false,
});

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
