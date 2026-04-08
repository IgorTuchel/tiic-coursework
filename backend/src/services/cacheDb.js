import redisClient from "../config/redis.js";
import ReportStatus from "../models/appdb/reportStatus.js";
import Roles from "../models/appdb/roles.js";
import SeverityLevel from "../models/appdb/severityLevel.js";
import Status from "../models/appdb/status.js";
import User from "../models/appdb/users.js";

export async function getUserStatuses() {
  const storedStatuses = await redisClient.get("userStatuses");
  if (storedStatuses) {
    return { success: true, data: JSON.parse(storedStatuses) };
  }

  const userStatuses = await Status.findAll();
  if (!userStatuses || userStatuses.length === 0) {
    return { success: false, message: "Failed to fetch user statuses" };
  }

  await redisClient.setEx("userStatuses", 3600, JSON.stringify(userStatuses));
  return { success: true, data: userStatuses };
}

export async function getUserStatusByID(statusID) {
  const userStatuses = await getUserStatuses();
  if (!userStatuses.success) {
    return { success: false, message: "Failed to fetch user statuses" };
  }

  const status = userStatuses.data.find((s) => s.statusID === statusID);
  if (!status) {
    return { success: false, message: "Status not found" };
  }

  return { success: true, data: status };
}

export async function invalidateUserStatusesCache() {
  await redisClient.del("userStatuses");
}

export async function getUserRoles() {
  const storedRoles = await redisClient.get("userRoles");
  if (storedRoles) {
    return { success: true, data: JSON.parse(storedRoles) };
  }

  const userRoles = await Roles.findAll();
  if (!userRoles || userRoles.length === 0) {
    return { success: false, message: "Failed to fetch user roles" };
  }

  await redisClient.setEx("userRoles", 3600, JSON.stringify(userRoles));
  return { success: true, data: userRoles };
}

export async function getUserRoleByID(roleID) {
  const userRoles = await getUserRoles();
  if (!userRoles.success) {
    return { success: false, message: "Failed to fetch user roles" };
  }

  const role = userRoles.data.find((r) => r.roleID === roleID);
  if (!role) {
    return { success: false, message: "Role not found" };
  }

  return { success: true, data: role };
}

export async function invalidateUserRolesCache() {
  await redisClient.del("userRoles");
}

export async function getUserByID(userID) {
  const storedUser = await redisClient.get(`user:${userID}`);
  if (storedUser) {
    return { success: true, data: JSON.parse(storedUser) };
  }

  const user = await User.findOne({
    where: { userID },
  });
  if (!user) {
    return { success: false, message: "User not found" };
  }

  await redisClient.setEx(`user:${userID}`, 3600, JSON.stringify(user));
  await redisClient.setEx(`userEmail:${user.email}`, 3600, userID);
  return { success: true, data: user };
}

export async function getUserByEmail(email) {
  const storedUserID = await redisClient.get(`userEmail:${email}`);
  if (storedUserID) {
    return getUserByID(storedUserID);
  }

  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    return { success: false, message: "User not found" };
  }

  await redisClient.setEx(`user:${user.userID}`, 3600, JSON.stringify(user));
  await redisClient.setEx(`userEmail:${user.email}`, 3600, user.userID);
  return { success: true, data: user };
}

export async function invalidateUserCache(userID) {
  const user = await getUserByID(userID);
  if (user.success) {
    await redisClient.del(`user:${userID}`);
    await redisClient.del(`userEmail:${user.data.email}`);
  }
}

export async function getSeverityLevels() {
  const storedLevels = await redisClient.get("severityLevels");
  if (storedLevels) {
    return { success: true, data: JSON.parse(storedLevels) };
  }

  const severityLevels = await SeverityLevel.findAll();
  if (!severityLevels || severityLevels.length === 0) {
    return { success: false, message: "Failed to fetch severity levels" };
  }

  await redisClient.setEx(
    "severityLevels",
    3600,
    JSON.stringify(severityLevels),
  );
  return { success: true, data: severityLevels };
}

export async function getSeverityLevelByID(severityLevelID) {
  const severityLevels = await getSeverityLevels();
  if (!severityLevels.success) {
    return { success: false, message: "Failed to fetch severity levels" };
  }

  const level = severityLevels.data.find(
    (l) => l.severityLevelID === severityLevelID,
  );
  if (!level) {
    return { success: false, message: "Severity level not found" };
  }

  return { success: true, data: level };
}

export async function invalidateSeverityLevelsCache() {
  await redisClient.del("severityLevels");
}

export async function getReportStatuses() {
  const storedStatuses = await redisClient.get("reportStatuses");
  if (storedStatuses) {
    return { success: true, data: JSON.parse(storedStatuses) };
  }

  const reportStatuses = await ReportStatus.findAll();
  if (!reportStatuses || reportStatuses.length === 0) {
    return { success: false, message: "Failed to fetch report statuses" };
  }

  await redisClient.setEx(
    "reportStatuses",
    3600,
    JSON.stringify(reportStatuses),
  );
  return { success: true, data: reportStatuses };
}

export async function getReportStatusByID(statusID) {
  const reportStatuses = await getReportStatuses();
  if (!reportStatuses.success) {
    return { success: false, message: "Failed to fetch report statuses" };
  }

  const status = reportStatuses.data.find((s) => s.reportStatusID === statusID);
  if (!status) {
    return { success: false, message: "Report status not found" };
  }

  return { success: true, data: status };
}

export async function invalidateReportStatusesCache() {
  await redisClient.del("reportStatuses");
}
