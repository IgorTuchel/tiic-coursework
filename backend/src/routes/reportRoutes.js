import express from "express";
import reportStatusRouter from "./reportStatusRoutes.js";
const router = express.Router();

router.use("/status", reportStatusRouter);
// router.use("/faults");

export default router;
