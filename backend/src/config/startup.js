import { verifyDbIntegrity } from "./db.js";
import cfg from "./config.js";
import { appendToErrorLog } from "../utils/errorWriter.js";

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
  let { message, successful, data } = await verifyDbIntegrity();
  if (!successful) {
    errorLog.push(
      "Startup error: " +
        message +
        "\nDatabase Status:\n" +
        Object.keys(data)
          .map((item) => `- ${item}: ${data[item]}`)
          .join("\n"),
    );
  }
  console.log(message);

  if (errorLog.length > 0) {
    await appendToErrorLog(cfg.errorLogFile, errorLog.join("\n"));
    console.error(errorMessage);
    console.error("Find Error Log at:", cfg.errorLogFile);
    process.exit(1);
  }

  console.log(successMessage);
}
