import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import { errorHandlingMiddleware } from "./middleware/errorHandler.js";
import { startup } from "./config/startup.js";
import cfg from "./config/config.js";
import { RedisStore } from "connect-redis";
import session from "express-session";
import { handlerLogin } from "./handlers/handlerLogin.js";

const app = express();
const redisStore = new RedisStore({
  client: startup.redisClient,
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

// Default health check, we'll remove later.
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "up", message: "Pong!" });
});

app.use("/users", userRouter);
app.use("/login", handlerLogin);

app.listen(cfg.port, async () => {
  await startup();
  console.log(`Server up at localhost:${cfg.port}`);
});

app.use(errorHandlingMiddleware);
