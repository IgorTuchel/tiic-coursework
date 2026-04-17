/**
 * @file index.js
 * @description Centralized model definitions and associations for the application database.
 * This file imports all individual model definitions to ensure they are registered with Sequelize and their associations are established.
 * @module models/appdb/index
 */
import "./faultReport.js";
import "./faultReportAssign.js";
import "./faultReportNotes.js";
import "./reportNotes.js";
import "./reportStatus.js";
import "./severityLevel.js";
import "./users.js";
import "./roles.js";
import "./status.js";
import "./maintenanceReport.js";
import "./maintenanceReportNotes.js";
import "./maintenanceReportAssign.js";
import "./toolCheck.js";
import "./maintenanceReportToolCheck.js";
