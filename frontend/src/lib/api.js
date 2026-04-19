import axios from "axios";

const API_URL = "/api";
const BYPASS = ["/login", "/activate-account"];

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API Error:", error);
    if (
      error.response?.status === 401 &&
      !BYPASS.includes(window.location.pathname)
    ) {
      console.log(error.response.status);
      window.location.href = "/login";
      return Promise.reject({ message: "Unauthorized. Redirecting to login." });
    }
    return Promise.reject(error);
  },
);

export default api;
