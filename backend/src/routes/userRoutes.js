import express from "express";
import { HTTPCodes, respondWithJson } from "../utils/json.js";

const router = express.Router();

router.get("/", (_, res) => {
  respondWithJson(res, HTTPCodes.OK, { message: "OK" });
});

export default router;
