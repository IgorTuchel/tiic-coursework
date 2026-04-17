/**
 * @file loginUserService.js
 * @description Service for user login with optional MFA support.
 * Sends a POST request to the backend API and handles responses and errors.
 * @module services/loginUserService
 */

import api from "../lib/api";

export const login = async (email, password, mfaCode = "") => {
  try {
    const res = await api.post("/login", {
      email,
      password,
      mfaCode,
    });

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    if (
      error.response?.status === 403 &&
      error.response?.data?.statusCode === "LOGIN_FAILURE_MFA_REQUIRED"
    ) {
      return {
        success: false,
        mfaRequired: true,
        message: error.response.data.error,
      };
    }
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "An error occurred during login.",
    };
  }
};
