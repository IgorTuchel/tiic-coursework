/**
 * @file AuthContext.jsx
 * @description Context provider for authentication state management.
 * Manages user authentication status, user data, and loading state.
 * @module context/AuthContext
 */

import { createContext, useState, useEffect } from "react";
import api from "../lib/api";

// ignore:start
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();
// ignore:end

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users/self", { withCredentials: true });
        if (res.status === 200) {
          setIsAuthenticated(true);
          setUser({
            email: res.data.email,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            mfaEnabled: res.data.mfaEnabled,
            role: res.data.role,
            createdAt: res.data.createdAt,
          });
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        setIsAuthenticated,
        setUser,
        setLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
