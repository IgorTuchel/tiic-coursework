/**
 * @file handlerGetSelf.js
 * @description Handler for retrieving the authenticated user's information.
 * @module handlers/users/handlerGetSelf.js
 */
import { UnauthorizedError } from "../../middleware/errorHandler.js";
import { HTTPCodes, respondWithJson } from "../../utils/json.js";
import { getUserRoleByID, getUserByID } from "../../services/cacheDb.js";

/**
 * Retrieves the authenticated user's information.
 * @async
 * @function handlerGetSelf
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function handlerGetSelf(req, res) {
    if (!req.session?.userID) {
        throw new UnauthorizedError(req, "You are not authenticated");
    }

    if (!req.session?.roleID) {
        throw new UnauthorizedError(req, "User role not found");
    }

    const userRole = await getUserRoleByID(req.session.roleID);
    if (!userRole.success) {
        throw new UnauthorizedError(req, userRole.message);
    }

    const user = await getUserByID(req.session.userID);
    if (!user.success) {
        throw new UnauthorizedError(req, user.message);
    }
    respondWithJson(res, HTTPCodes.OK, {
        success: true,
        data: {
            email: user.data.email,
            role: userRole.data.roleName,
            firstName: user.data.firstName,
            lastName: user.data.lastName,
            mfaEnabled: user.data.mfaEnabled,
            createdAt: user.data.createdAt,
            roleInfo: {
                isAdmin: userRole.data.isAdmin,
                canManageUsers: userRole.data.canManageUsers,
                canManageRoles: userRole.data.canManageRoles,
                canViewAllUsers: userRole.data.canViewAllUsers,
                canViewSecurityLogs: userRole.data.canViewSecurityLogs,
                canViewActivityLogs: userRole.data.canViewActivityLogs,
                canViewAllReports: userRole.data.canViewAllReports,
                canWorkOnReports: userRole.data.canWorkOnReports,
                canManageReports: userRole.data.canManageReports,
                canManageTools: userRole.data.canManageTools,
                canSuggestFaults: userRole.data.canSuggestFaults,
                canAssignReports: userRole.data.canAssignReports,
                canManageFaults: userRole.data.canManageFaults,
                canViewAllFaults: userRole.data.canViewAllFaults,
                canAssignFaults: userRole.data.canAssignFaults,
                mfaRequired: userRole.data.mfaRequired,
            },
        },
    });
}
