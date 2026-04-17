import cfg from "./config.js";
import { appendToErrorLog } from "../utils/errorWriter.js";
import { verifyResendConnection } from "./resend.js";
import { sendEmailWithResend } from "../services/sendEmail.js";
import { verifyRedisConnection } from "./redis.js";
import { hashPassword } from "../utils/hashPassword.js";
import { db } from "./db.js";
import { verifyDbIntegrity, registerHooks } from "./dbStartup.js";

const startupMessage = `
===========================
    Starting service integrity checks...
===========================
`;

const errorMessage = `
===========================
    Service startup encountered errors. Shutting down...    
===========================
`;

const successMessage = `
===========================
    All services started successfully.
===========================
`;

let errorLog = [];

export async function startup() {
  console.log(startupMessage);
  await registerHooks();
  let {
    message: dbMessage,
    successful: dbSuccessful,
    data: dbData,
  } = await verifyDbIntegrity();
  if (!dbSuccessful) {
    errorLog.push(
      "Startup error: " +
        dbMessage +
        "\nDatabase Status:\n" +
        Object.keys(dbData)
          .map((item) => `- ${item}: ${dbData[item]}`)
          .join("\n"),
    );
  }
  console.log(dbMessage);

  // let {
  //   message: resendMessage,
  //   successful: resendSuccessful,
  //   data: resendData,
  // } = await verifyResendConnection();
  // if (!resendSuccessful) {
  //   errorLog.push(
  //     "Startup error: " +
  //       resendMessage +
  //       "\nResend API Error:\n" +
  //       JSON.stringify(resendData.error, null, 2),
  //   );
  // }
  // console.log(resendMessage);

  let {
    message: redisMessage,
    successful: redisSuccessful,
    data: redisData,
  } = await verifyRedisConnection();
  if (!redisSuccessful) {
    errorLog.push(
      "Startup error: " +
        redisMessage +
        "\nRedis Connection Error:\n" +
        JSON.stringify(redisData.error, null, 2),
    );
  }
  console.log(redisMessage);

  if (errorLog.length > 0) {
    await appendToErrorLog(cfg.errorLogFile, errorLog.join("\n"));
    console.error(errorMessage);
    console.error("Find Error Log at:", cfg.errorLogFile);
    process.exit(1);
  }

  console.log(successMessage);
}
