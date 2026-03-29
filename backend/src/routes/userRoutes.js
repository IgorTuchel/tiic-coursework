import express from "express";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import statusRouter from "./statusRoutes.js";

const router = express.Router();

router.get("/", (_, res) => {
  respondWithJson(res, HTTPCodes.OK, { message: "OK" });
});

router.use("/status", statusRouter);

export default router;
