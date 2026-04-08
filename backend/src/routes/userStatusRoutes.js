import { handlerCreateUserStatus } from "../handlers/users/status/handlerCreateUserStatus.js";
import { handlerGetUserStatus } from "../handlers/users/status/handlerGetUserStatus.js";
import { handlerDeleteUserStatus } from "../handlers/users/status/handlerDeleteUserStatus.js";
import { handlerUpdateUserStatus } from "../handlers/users/status/handlerUpdateUserStatus.js";
import express from "express";
import { permissionGuard } from "../middleware/permissionGuard.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get(
  "/",
  protectedRoute,
  permissionGuard("canViewAllUsers"),
  handlerGetUserStatus,
);
router.post(
  "/",
  protectedRoute,
  permissionGuard("isAdmin"),
  handlerCreateUserStatus,
);
router.delete(
  "/:id",
  protectedRoute,
  permissionGuard("isAdmin"),
  handlerDeleteUserStatus,
);
router.put(
  "/:id",
  protectedRoute,
  permissionGuard("isAdmin"),
  handlerUpdateUserStatus,
);

export default router;
