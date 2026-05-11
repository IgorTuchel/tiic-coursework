/**
 * @file handlerResetPassword.js
 * @description Handler for resetting a user's password.
 * @module handlers/users/handlerResetPassword.js
 */
import cfg from "../../config/config.js";
import User from "../../models/appdb/users.js";
import { invalidateUserCache } from "../../services/cacheDb.js";
import {
    createResetToken,
    invalidateResetToken,
    verifyResetToken,
} from "../../services/resetPassword.js";
import {
    emailTemplates,
    sendEmailWithResend,
} from "../../services/sendEmail.js";
import { hashPassword } from "../../utils/hashPassword.js";
import {
    HTTPCodes,
    respondWithErrorJson,
    respondWithJson,
} from "../../utils/json.js";
import { evaulatePassword } from "../../utils/passwordStrength.js";

/**
 * Requests a password reset for the user with the given email.
 * @async
 * @function handlerRequestResetPassword
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function handlerRequestResetPassword(req, res) {
    const { email } = req.body;
    const { token } = req.query;

    if (token) {
        return await handlerResetPassword(req, res);
    }
    if (!email || typeof email !== "string") {
        return respondWithErrorJson(res, HTTPCodes.BAD_REQUEST, {
            success: false,
            message: "Email is required and must be a string.",
        });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return respondWithJson(res, HTTPCodes.OK, {
            success: true,
            message:
                "If an account with that email exists, a reset link has been sent.",
        });
    }

    const result = await createResetToken(user.userID);
    if (!result.success) {
        return respondWithErrorJson(res, HTTPCodes.INTERNAL_SERVER_ERROR, {
            success: false,
            message: "Failed to create reset token.",
        });
    }

    const resetLink = cfg.resetPasswordUrl + `?token=${result.token}`;
    const emailBody = emailTemplates.resetPassword.replace(
        "{{LINK}}",
        resetLink,
    );
    const emailRes = await sendEmailWithResend(
        user.email,
        cfg.resendSender,
        "Reset Your Password",
        emailBody,
    );
    if (!emailRes.success) {
        return respondWithErrorJson(res, HTTPCodes.INTERNAL_SERVER_ERROR, {
            success: false,
            message: "Failed to send reset email.",
        });
    }

    return respondWithJson(res, HTTPCodes.OK, {
        success: true,
        message:
            "If an account with that email exists, a reset link has been sent.",
    });
}

/**
 * Resets a user's password using the provided token and new password.
 * @async
 * @function handlerResetPassword
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function handlerResetPassword(req, res) {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== "string") {
        return respondWithErrorJson(res, HTTPCodes.BAD_REQUEST, {
            success: false,
            message: "New password is required and must be a string.",
        });
    }

    const passwordStrength = evaulatePassword(newPassword);
    if (!passwordStrength.valid) {
        return respondWithErrorJson(res, HTTPCodes.BAD_REQUEST, {
            success: false,
            message: passwordStrength.reason,
        });
    }

    const verifyResult = await verifyResetToken(token);
    if (!verifyResult.success) {
        return respondWithErrorJson(res, HTTPCodes.BAD_REQUEST, {
            success: false,
            message: verifyResult.message,
        });
    }

    const userID = verifyResult.userID;

    const hashedPass = await hashPassword(newPassword);

    const updated = await User.update(
        { passwordHash: hashedPass },
        { where: { userID } },
    );
    if (updated[0] === 0) {
        return respondWithErrorJson(res, HTTPCodes.INTERNAL_SERVER_ERROR, {
            success: false,
            message: "Failed to update password.",
        });
    }

    await invalidateResetToken(token);
    await invalidateUserCache(userID);
    return respondWithJson(res, HTTPCodes.OK, {
        success: true,
        message: "Password has been reset successfully.",
    });
}
