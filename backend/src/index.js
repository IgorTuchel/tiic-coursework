import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import { errorHandlingMiddleware } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import { startup } from "./config/startup.js";
import cfg from "./config/config.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Default health check, we'll remove later.
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "up", message: "Pong!" });
});

app.use("/users", userRouter);

app.listen(cfg.port, async () => {
  await startup();
  console.log(`Server up at localhost:${cfg.port}`);
});

app.use(errorHandlingMiddleware);
