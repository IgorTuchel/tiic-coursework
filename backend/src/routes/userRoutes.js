import express from "express";
import statusRouter from "./statusRoutes.js";
import { handlerCreateUser } from "../handlers/handlerCreateUser.js";
import { handlerGetUserById } from "../handlers/handlerGetUserById.js";
import { handlerGetSelf } from "../handlers/handlerGetSelf.js";
import { permissionGuard } from "../middleware/permissionGuard.js";
import { handlerGetAllUsers } from "../handlers/handlerGetAllUsers.js";
const router = express.Router();

router.get("/", permissionGuard("canViewAllUsers"), handlerGetAllUsers);

router.get("/self", handlerGetSelf);

router.use("/status", statusRouter);

router.get("/:id", handlerGetUserById);

router.post("/", handlerCreateUser);

export default router;
