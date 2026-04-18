// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import DashboardPage from "./pages/DashboardPage";
import ArMaintenancePage from "./pages/ArMaintenancePage";
import CheckToolsPage from "./pages/CheckToolsPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserManagementPage from "./pages/UserManagementPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ProtectedPage from "./components/ProtectedPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          error: {
            style: {
              background: "#1e293b",
              color: "#f8f8f8",
            },
          },
          success: {
            style: {
              background: "#1e293b",
              color: "#f8f8f8",
            },
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app" element={<ProtectedPage />}>
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/app/ar" element={<ArMaintenancePage />} />
          <Route path="/app/check-tools" element={<CheckToolsPage />} />
          <Route path="/app/admin" element={<UserManagementPage />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
