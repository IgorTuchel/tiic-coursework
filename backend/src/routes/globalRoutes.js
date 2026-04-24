import express from "express";
import userRouter from "./userRoutes.js";
import reportRouter from "./reportRoutes.js";
import { handlerLogin } from "../handlers/handlerLogin.js";
import { handlerActivateAccount } from "../handlers/handlerActivateAccount.js";
import { handlerLogout } from "../handlers/handlerLogout.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { handlerGetErrorLogs } from "../handlers/handlerGetLogs.js";
import { permissionGuard } from "../middleware/permissionGuard.js";
import { handlerRequestResetPassword } from "../handlers/users/handlerResetPassword.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/reports", reportRouter);
router.post("/login", handlerLogin);
router.post("/logout", handlerLogout);
router.post("/activate-account", handlerActivateAccount);
router.post("/reset-password", handlerRequestResetPassword);
router.get(
  "/logs",
  protectedRoute,
  permissionGuard("canViewSecurityLogs"),
  handlerGetErrorLogs,
);

export default router;
