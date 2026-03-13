import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import { errorHandlingMiddleware } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Default health check, we'll remove later.
app.get("/ping", (_, res) => {
  res.status(200).json({ status: "up", message: "Pong!" });
});

app.use("/users", userRouter);

app.listen(3000, async () => {
  console.log("Server up at localhost:3000");
});

app.use(errorHandlingMiddleware);
