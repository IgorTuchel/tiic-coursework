import cfg from "./config.js";
import { Resend } from "resend";

const resendClient = new Resend(cfg.resendApiKey);

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
