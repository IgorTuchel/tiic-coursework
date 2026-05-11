/**
 * Creates a reset token for a user.
 * @param {string} userID - The ID of the user.
 * @returns {object} - The result of the token creation operation.
 */
import redisClient from "../config/redis.js";
import crypto from "crypto";

/**
 * Creates a reset token for a user.
 * @param {string} userID - The ID of the user.
 * @returns {object} - The result of the token creation operation.
 */
export async function createResetToken(userID) {
    const token = crypto.randomBytes(32).toString("hex");
    const res = await redisClient.setEx(`resetPassword:${token}`, 3600, userID);
    if (res !== "OK") {
        return { success: false, message: "Failed to create reset token" };
    }
    return { success: true, token };
}

/**
 * Verifies a reset token for a user.
 * @param {string} token - The reset token to verify.
 * @returns {object} - The result of the verification operation.
 */
export async function verifyResetToken(token) {
    const userID = await redisClient.get(`resetPassword:${token}`);
    if (!userID) {
        return { success: false, message: "Invalid or expired reset token" };
    }
    return { success: true, userID };
}

/**
 * Invalidates a reset token for a user.
 * @param {string} token - The reset token to invalidate.
 * @returns {object} - The result of the invalidation operation.
 */
export async function invalidateResetToken(token) {
    await redisClient.del(`resetPassword:${token}`);
}
