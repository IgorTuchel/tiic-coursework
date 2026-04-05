import { handlerCreateUserStatus } from "../handlers/handlerCreateUserStatus.js";
import { handlerGetUserStatus } from "../handlers/handlerGetUserStatus.js";
import { handlerDeleteUserStatus } from "../handlers/handlerDeleteUserStatus.js";
import { handlerUpdateUserStatus } from "../handlers/handlerUpdateUserStatus.js";
import express from "express";
import { permissionGuard } from "../middleware/permissionGuard.js";

const router = express.Router();

router.get("/", permissionGuard("canManageUsers"), handlerGetUserStatus);
router.post("/", handlerCreateUserStatus);
router.delete("/:id", handlerDeleteUserStatus);
router.put("/:id", handlerUpdateUserStatus);

export default router;
