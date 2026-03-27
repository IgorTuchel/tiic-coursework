/**
 * @file resend.js
 * @description Resend API client configuration and connection verification.
 * Defines the Resend client instance and a function to verify connectivity by sending a test email.
 * @module config/resend
 */
import cfg from "./config.js";
import { Resend } from "resend";

/**
 * The configured Resend client instance.
 * @type {Resend}
 * @description Note: The client is created here but not yet verified.
 * Connection is verified in the startup orchestrator by sending a test email.
 * @see https://resend.com/docs/node-sdk
 */
const resendClient = new Resend(cfg.resendApiKey);

/**
 * Verifies the Resend API connection by sending a test email to a known address.
 * @async
 * @function verifyResendConnection
 * @returns {Promise<{message: string, successful: boolean, data: object}>} An object containing the verification result.
 * @description This function is designed to be called during the application startup process to ensure the Resend API is operational before proceeding.
 */
export async function verifyResendConnection() {
  try {
    const { data, error } = await resendClient.emails.send({
      from: cfg.resendSender,
      to: "delivered@resend.dev",
      subject: "Test Email from Service Startup",
      html: "<strong>This is a test email to verify Resend connection.</strong>",
    });
    if (error) {
      return {
        message: "Resend API connection failed",
        successful: false,
        data: { error: error },
      };
    }
    return {
      message: "Resend API connection verified",
      successful: true,
      data: { response: data },
    };
  } catch (err) {
    return {
      message: "Resend API connection failed with exception",
      successful: false,
      data: { error: err.message },
    };
  }
}

export default resendClient;
