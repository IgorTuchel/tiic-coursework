import express from "express";
import statusRouter from "./statusRoutes.js";
import { handlerCreateUser } from "../handlers/users/handlerCreateUser.js";
import { handlerGetUserById } from "../handlers/users/handlerGetUserById.js";
import { handlerGetSelf } from "../handlers/users/handlerGetSelf.js";
import { permissionGuard } from "../middleware/permissionGuard.js";
import { handlerGetAllUsers } from "../handlers/users/handlerGetAllUsers.js";
import {
  handlerUpdateSelf,
  handlerUpdateUser,
} from "../handlers/users/handlerUpdateUser.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const router = express.Router();

router.get(
  "/",
  protectedRoute,
  permissionGuard("canViewAllUsers"),
  handlerGetAllUsers,
);
router.post(
  "/",
  protectedRoute,
  permissionGuard("canManageUsers"),
  handlerCreateUser,
);

router.get("/self", protectedRoute, handlerGetSelf);
router.put("/self", protectedRoute, handlerUpdateSelf);

router.use("/status", statusRouter);

router.get("/:id", protectedRoute, handlerGetUserById);
router.delete(
  "/:id",
  protectedRoute,
  permissionGuard("canManageUsers"),
  handlerDeactivateAccount,
);
router.put(
  "/:id",
  protectedRoute,
  permissionGuard("canManageUsers"),
  handlerUpdateUser,
);

export default router;
