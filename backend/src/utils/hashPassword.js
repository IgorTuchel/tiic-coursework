/**
 * @file hashPassword.js
 * @description Utility functions for hashing and comparing passwords using bcrypt.
 * @module utils/hashPassword
 */

import bcrypt from "bcrypt";

/**
 * Hashes a plain text password using bcrypt.
 * @function hashPassword
 * @async
 * @param {string} plainPassword - The plain text password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export async function hashPassword(plainPassword) {
  const saltRounds = 13;
  const hashsedPass = await bcrypt.hash(plainPassword, saltRounds);
  return hashsedPass;
}

/**
 * Compares a plain text password with a hashed password.
 * @function comparePassword
 * @async
 * @param {string} plainPassword - The plain text password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
export async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
