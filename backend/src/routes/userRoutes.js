import express from "express";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import statusRouter from "./statusRoutes.js";
import { handlerCreateUser } from "../handlers/handlerCreateUser.js";

const router = express.Router();

router.get("/", (_, res) => {
  respondWithJson(res, HTTPCodes.OK, { message: "OK" });
});

router.post("/", handlerCreateUser);

router.use("/status", statusRouter);

export default router;
