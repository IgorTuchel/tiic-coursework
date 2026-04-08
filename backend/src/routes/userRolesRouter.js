import { handlerGetUserRoles } from "../handlers/users/roles/handlerGetUserRoles.js";
import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { permissionGuard } from "../middleware/permissionGuard.js";

const router = express.Router();

router.get(
  "/",
  protectedRoute,
  permissionGuard("canViewAllUsers"),
  handlerGetUserRoles,
);

export default router;
