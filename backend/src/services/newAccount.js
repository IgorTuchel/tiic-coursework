import cfg from "../config/config.js";
import redisClient from "../config/redis.js";
import { emailTemplates, sendEmailWithResend } from "./sendEmail.js";
import User from "../models/appdb/users.js";
import crypto from "crypto";
import { getUserByID } from "./cacheDb.js";

export async function newUserRegistration(userID) {
  const dbUser = await getUserByID(userID);
  if (!dbUser.success) {
    throw new Error("User not found for new user registration");
  }

  const code = crypto.randomBytes(20).toString("hex");
  await redisClient.setEx(`newUser:${code}`, 3600, dbUser.data.userID); // Code valid for 1 hour
  await sendEmailWithResend(
    dbUser.data.email,
    cfg.resendSender,
    "Complete Your Registration",
    emailTemplates.setupAccount.replace(
      "{{LINK}}",
      `${cfg.activateAccountUrl}?id=${code}`,
    ),
  );
  return { success: true, message: "Registration email sent" };
}

export async function verifyNewUser(code) {
  const storedUserID = await redisClient.get(`newUser:${code}`);
  if (!storedUserID) {
    return { success: false, message: "Invalid or expired url parameter" };
  }

  await redisClient.del(`newUser:${code}`);
  return {
    success: true,
    message: "Account activated successfully",
    userID: storedUserID,
  };
}
