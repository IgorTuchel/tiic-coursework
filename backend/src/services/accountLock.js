/**
 * @file accountLock.js
 * @description Service for managing account lock status and failed login attempts using Redis.
 * Provides functions to check if an account is locked, lock an account after multiple failed attempts,
 * and reset failed login attempts after a successful login.
 * @module services/accountLock
 */
import redisClient from "../config/redis.js";

export async function getAccountIsLocked(userID) {
  const storedLockStatus = await redisClient.get(`accountLocked:${userID}`);
  if (storedLockStatus) {
    return { success: true, data: JSON.parse(storedLockStatus) };
  }
  return { success: false, data: null };
}

/**
 * Sets the account lock status for a user in Redis. The lock status expires after 1 hour.
 *
 * @async
 * @param {number} userID - The ID of the user whose account lock status is being set.
 * @param {boolean} isLocked - The lock status to set (true for locked, false for unlocked).
 * @returns {Promise<Object>} An object containing the success status and a message about the operation.
 * @returns {boolean} returns.success - Whether the account lock status was successfully set.
 * @returns {string} returns.message - A message describing the result of the operation.
 */
async function setAccountLockStatus(userID, isLocked) {
  await redisClient.setEx(
    `accountLocked:${userID}`,
    3600,
    JSON.stringify(isLocked),
  ); // Lock status expires after 1 hour
  return {
    success: true,
    message: `Account lock status for user ${userID} set to ${isLocked}`,
  };
}

/**
 * Increments the failed login attempts for a user in Redis. If the number of failed attempts reaches 10, the account is locked.
 *
 * @async
 * @param {number} userID - The ID of the user whose failed login attempts are being incremented.
 * @returns {Promise<Object>} An object containing the success status and either the number of failed attempts or a message about account locking.
 * @returns {boolean} returns.success - Whether the failed login attempts were successfully incremented or if the account was locked.
 * @returns {number|string} returns.data - The number of failed login attempts if incremented, or a message about account locking if the threshold was reached.
 */
async function incrementFailedLoginAttempts(userID) {
  const storedAttempts = await redisClient.get(`failedLoginAttempts:${userID}`);
  let attempts = parseInt(storedAttempts);
  attempts += 1;
  await redisClient.setEx(
    `failedLoginAttempts:${userID}`,
    3600,
    attempts.toString(),
  ); // Failed attempts expire after 1 hour
  return { success: true, data: attempts };
}

/**
 * Resets the failed login attempts for a user in Redis by deleting the corresponding key.
 *
 * @async
 * @param {number} userID - The ID of the user whose failed login attempts are being reset.
 * @returns {Promise<Object>} An object containing the success status and a message about the operation.
 * @returns {boolean} returns.success - Whether the failed login attempts were successfully reset.
 * @returns {string} returns.message - A message describing the result of the operation.
 */
export async function resetFailedLoginAttempts(userID) {
  await redisClient.del(`failedLoginAttempts:${userID}`);
  return { success: true };
}

/**
 * Locks a user's account after incrementing the failed login attempts. If the number of failed attempts reaches 10, the account is locked.
 *
 * @async
 * @param {number} userID - The ID of the user whose account is being locked.
 * @returns {Promise<Object>} An object containing the success status and a message about the operation.
 * @returns {boolean} returns.success - Whether the account was successfully locked or if the failed attempts were incremented.
 * @returns {string} returns.message - A message describing the result of the operation, either about incrementing failed attempts or locking the account.
 */
export async function lockAccount(userID) {
  const incrementd = await incrementFailedLoginAttempts(userID);
  if (incrementd.data >= 10) {
    // Lock account after 10 failed attempts
    const locked = await setAccountLockStatus(userID, true);
    return locked;
  }
  return {
    success: false,
    message: `Failed login attempts for user ${userID} incremented to ${incrementd.data}`,
  };
}
