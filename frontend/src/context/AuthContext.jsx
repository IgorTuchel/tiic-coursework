// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    const { accessToken, refreshToken, user: userData } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);

    return response.data;
  }, []);

  const signup = useCallback(async (userData) => {
    const response = await api.post("/users/signup", userData);
    return response.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    return api.post("/users/forgot-password", { email });
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    return api.post("/users/reset-password", { token, newPassword });
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
