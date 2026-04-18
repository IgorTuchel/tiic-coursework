import express from "express";
import userRouter from "./userRoutes.js";
import reportRouter from "./reportRoutes.js";
import { handlerLogin } from "../handlers/handlerLogin.js";
import { handlerActivateAccount } from "../handlers/handlerActivateAccount.js";
import { handlerLogout } from "../handlers/handlerLogout.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/reports", reportRouter);
router.post("/login", handlerLogin);
router.post("/logout", handlerLogout);
router.post("/activate-account", handlerActivateAccount);

export default router;
