import express from "express";
import cors from "cors";
import globalRouter from "./routes/globalRoutes.js";
import { errorHandlingMiddleware } from "./middleware/errorHandler.js";
import { startup } from "./config/startup.js";
import cfg from "./config/config.js";
import { RedisStore } from "connect-redis";
import session from "express-session";
import redisClient from "./config/redis.js";
import { sanitiseInputMiddleware } from "./middleware/sanitiseMiddleware.js";

await startup();

const app = express();
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "app-session:",
});

app.use(express.json());

app.use(
  session({
    store: redisStore,
    secret: cfg.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  }),
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/", sanitiseInputMiddleware, globalRouter);

app.listen(cfg.port, async () => {
  console.log(`Server up at localhost:${cfg.port}`);
});

app.use(errorHandlingMiddleware);
