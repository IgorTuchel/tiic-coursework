import redisClient from "../config/redis.js";
import crypto from "crypto";

export async function createResetToken(userID) {
  const token = crypto.randomBytes(32).toString("hex");
  const res = await redisClient.setEx(`resetPassword:${token}`, 3600, userID);
  if (res !== "OK") {
    return { success: false, message: "Failed to create reset token" };
  }
  return { success: true, token };
}

export async function verifyResetToken(token) {
  const userID = await redisClient.get(`resetPassword:${token}`);
  if (!userID) {
    return { success: false, message: "Invalid or expired reset token" };
  }
  return { success: true, userID };
}

export async function invalidateResetToken(token) {
  await redisClient.del(`resetPassword:${token}`);
}
