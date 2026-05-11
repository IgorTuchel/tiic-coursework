/**
 * @file workOnReport.js
 * @description Assigns a user to a fault report or maintenance report.
 */
import FaultReportAssign from "../models/appdb/faultReportAssign.js";
import MaintenanceReportAssign from "../models/appdb/maintenanceReportAssign.js";

/**
 * Checks if a user is assigned to a fault report.
 * @param {string} userID - The ID of the user.
 * @param {string} reportID - The ID of the fault report.
 * @returns {boolean} - True if the user is assigned, false otherwise.
 */
export async function userAssignedToFaultReport(userID, reportID) {
    const assigned = await FaultReportAssign.findOne({
        where: {
            userID,
            faultReportID: reportID,
        },
    });
    if (!assigned) {
        return false;
    }
    return true;
}

/**
 * Assigns a user to a fault report.
 * @param {string} userID - The ID of the user.
 * @param {string} reportID - The ID of the fault report.
 * @returns {object} - The result of the assignment operation.
 */
export async function assignUserToFaultReport(userID, reportID) {
    const existingAssignment = await FaultReportAssign.findOne({
        where: {
            userID,
            faultReportID: reportID,
        },
    });
    if (existingAssignment) {
        return {
            success: false,
            message: "User already assigned to this fault report",
        };
    }

    const newAssignment = await FaultReportAssign.create({
        userID,
        faultReportID: reportID,
    });

    if (!newAssignment) {
        return {
            success: false,
            message: "Failed to assign user to fault report",
        };
    }

    return { success: true, data: newAssignment };
}

/**
 * Unassigns a user from a fault report.
 * @param {string} userID - The ID of the user.
 * @param {string} reportID - The ID of the fault report.
 * @returns {object} - The result of the unassignment operation.
 */
export async function unassignUserFromFaultReport(userID, reportID) {
    const existingAssignment = await FaultReportAssign.findOne({
        where: {
            userID,
            faultReportID: reportID,
        },
    });
    if (!existingAssignment) {
        return {
            success: false,
            message: "User is not assigned to this fault report",
        };
    }

    const deleted = await existingAssignment.destroy();
    if (!deleted) {
        return {
            success: false,
            message: "Failed to unassign user from fault report",
        };
    }

    return { success: true };
}

/**
 * Checks if a user is assigned to a maintenance report.
 * @param {string} userID - The ID of the user.
 * @param {string} reportID - The ID of the maintenance report.
 * @returns {boolean} - True if the user is assigned, false otherwise.
 */
export async function userAssignedToMaintenanceReport(userID, reportID) {
    const assigned = await MaintenanceReportAssign.findOne({
        where: {
            userID,
            maintenanceReportID: reportID,
        },
    });
    if (!assigned) {
        return false;
    }
    return true;
}

/**
 * Assigns a user to a maintenance report.
 * @param {string} userID - The ID of the user.
 * @param {string} reportID - The ID of the maintenance report.
 * @returns {object} - The result of the assignment operation.
 */
export async function assignUserToMaintenanceReport(userID, reportID) {
    const existingAssignment = await userAssignedToMaintenanceReport(
        userID,
        reportID,
    );

    if (existingAssignment) {
        return {
            success: false,
            message: "User already assigned to this maintenance report",
        };
    }

    const newAssignment = await MaintenanceReportAssign.create({
        userID,
        maintenanceReportID: reportID,
    });

    if (!newAssignment) {
        return {
            success: false,
            message: "Failed to assign user to maintenance report",
        };
    }

    return { success: true, data: newAssignment };
}

/**
 * Unassigns a user from a maintenance report.
 * @param {string} userID - The ID of the user.
 * @param {string} reportID - The ID of the maintenance report.
 * @returns {object} - The result of the unassignment operation.
 */
export async function unassignUserFromMaintenanceReport(userID, reportID) {
    const existingAssignment = await userAssignedToMaintenanceReport(
        userID,
        reportID,
    );
    if (!existingAssignment) {
        return {
            success: false,
            message: "User is not assigned to this maintenance report",
        };
    }

    const deleted = await MaintenanceReportAssign.destroy({
        where: {
            userID,
            maintenanceReportID: reportID,
        },
    });
    if (!deleted) {
        return {
            success: false,
            message: "Failed to unassign user from maintenance report",
        };
    }

    return { success: true };
}
