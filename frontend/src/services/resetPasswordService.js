import api from "../lib/api";

export const requestPasswordReset = async (email, token, newPassword) => {
  try {
    const response = await api.post(
      `/reset-password${token ? `?token=${token}` : ""}`,
      { email, newPassword },
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error.message ||
        error.message ||
        "Failed to request password reset.",
    };
  }
};
