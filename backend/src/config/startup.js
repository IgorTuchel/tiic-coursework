import { verifyDbIntegrity } from "./db.js";

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

export async function startup() {
  console.log(startupMessage);
  let { message, successful, data } = await verifyDbIntegrity();
  if (!successful) {
    console.error(message);
    console.log(
      "Databases status:\n" +
        Object.keys(data)
          .map((item) => `${item}: ${data[item]}`)
          .join("\n"),
    );
    console.error(errorMessage);
    process.exit(1);
  }
  console.log(message);
  console.log(successMessage);
}
