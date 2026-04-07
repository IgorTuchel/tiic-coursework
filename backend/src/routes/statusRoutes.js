import { handlerCreateUserStatus } from "../handlers/users/handlerCreateUserStatus.js";
import { handlerGetUserStatus } from "../handlers/users/handlerGetUserStatus.js";
import { handlerDeleteUserStatus } from "../handlers/users/handlerDeleteUserStatus.js";
import { handlerUpdateUserStatus } from "../handlers/users/handlerUpdateUserStatus.js";
import express from "express";
import { permissionGuard } from "../middleware/permissionGuard.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get(
  "/",
  protectedRoute,
  permissionGuard("canManageUsers"),
  handlerGetUserStatus,
);
router.post(
  "/",
  protectedRoute,
  permissionGuard("canManageUsers"),
  handlerCreateUserStatus,
);
router.delete(
  "/:id",
  protectedRoute,
  permissionGuard("canManageUsers"),
  handlerDeleteUserStatus,
);
router.put(
  "/:id",
  protectedRoute,
  permissionGuard("canManageUsers"),
  handlerUpdateUserStatus,
);

export default router;
