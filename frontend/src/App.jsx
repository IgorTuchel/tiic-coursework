// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserManagementPage from "./pages/UserManagementPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedPage from "./components/ProtectedPage.jsx";
import ActivateAccountPage from "./pages/ActivateAccountPage.jsx";
import { MaintenancePage } from "./pages/MaintenancePage.jsx";
import { MaintenanceDetailPage } from "./pages/MaintenanceDetailPage.jsx";
import { FaultPage } from "./pages/FaultPage.jsx";
import { FaultDetailPage } from "./pages/FaultDetailPage.jsx";
import ErrorLogsPage from "./pages/ErrorLogsPage.jsx";

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
        <Route path="/activate-account" element={<ActivateAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/app" element={<ProtectedPage />}>
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/app/maintenance" element={<MaintenancePage />} />
          <Route
            path="/app/maintenance/:id"
            element={<MaintenanceDetailPage />}
          />
          <Route path="/app/faults" element={<FaultPage />} />
          <Route path="/app/faults/:id" element={<FaultDetailPage />} />
          <Route path="/app/logs" element={<ErrorLogsPage />} />
          <Route path="/app/admin" element={<UserManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
