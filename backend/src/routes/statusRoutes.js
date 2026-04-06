import { handlerCreateUserStatus } from "../handlers/handlerCreateUserStatus.js";
import { handlerGetUserStatus } from "../handlers/handlerGetUserStatus.js";
import { handlerDeleteUserStatus } from "../handlers/handlerDeleteUserStatus.js";
import { handlerUpdateUserStatus } from "../handlers/handlerUpdateUserStatus.js";
import express from "express";
import { permissionGuard } from "../middleware/permissionGuard.js";

const router = express.Router();

router.get("/", permissionGuard("canManageUsers"), handlerGetUserStatus);
router.post("/", permissionGuard("canManageUsers"), handlerCreateUserStatus);
router.delete(
  "/:id",
  permissionGuard("canManageUsers"),
  handlerDeleteUserStatus,
);
router.put("/:id", permissionGuard("canManageUsers"), handlerUpdateUserStatus);

export default router;
