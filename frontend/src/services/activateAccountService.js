import api from "../lib/api";

export const activateAccount = async (token, password) => {
  try {
    const response = await api.post(
      `/activate-account?id=${token}`,
      { password },
      { withCredentials: true },
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response.data };
  }
};
