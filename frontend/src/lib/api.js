import axios from "axios";

const API_URL = "/api";
const BYPASS = ["/users/login", "/users/signup", "/auth/2fa", "/users/forgot-password", "/users/reset-password"];

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const shouldBypass = BYPASS.some(url => originalRequest.url.includes(url));

    if (error.response?.status === 401 && !shouldBypass && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 && shouldBypass) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject({ message: "Unauthorized. Redirecting to login." });
    }

    return Promise.reject(error);
  }
);

export default api;
