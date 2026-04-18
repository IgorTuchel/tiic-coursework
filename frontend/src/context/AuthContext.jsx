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
            email: res.data.data.email,
            firstName: res.data.data.firstName,
            lastName: res.data.data.lastName,
            mfaEnabled: res.data.data.mfaEnabled,
            role: res.data.data.role,
            createdAt: res.data.data.createdAt,
            roleInfo: res.data.data.roleInfo,
          });
          console.log("User authenticated:", res.data);
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
  }, [isAuthenticated]);

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
