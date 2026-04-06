import express from "express";
import { HTTPCodes, respondWithJson } from "../utils/json.js";
import statusRouter from "./statusRoutes.js";
import { handlerCreateUser } from "../handlers/handlerCreateUser.js";
import { handlerGetUserById } from "../handlers/handlerGetUserById.js";
import { handlerGetSelf } from "../handlers/handlerGetSelf.js";
const router = express.Router();

router.get("/", (_, res) => {
  respondWithJson(res, HTTPCodes.OK, { message: "OK" });
});

router.get("/self", handlerGetSelf);

router.use("/status", statusRouter);

router.get("/:id", handlerGetUserById);

router.post("/", handlerCreateUser);

export default router;
