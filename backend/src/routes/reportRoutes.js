import express from "express";
import reportStatusRouter from "./reportStatusRoutes.js";
import reportFaultsRouter from "./reportFaultsRoutes.js";
import reportSeverityRouter from "./reportSeverityRoutes.js";
import reportMaintenanceRouter from "./reportMaintenanceRoutes.js";
const router = express.Router();

router.use("/status", reportStatusRouter);
router.use("/severity", reportSeverityRouter);
router.use("/faults", reportFaultsRouter);
router.use("/maintenance", reportMaintenanceRouter);

export default router;
