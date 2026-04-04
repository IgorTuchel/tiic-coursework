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

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'bg-slate-800 text-slate-100 border border-slate-700',
          style: {
            background: '#1e293b', 
            color: '#f1f5f9',      
            border: '1px solid #334155' 
          }
        }} 
      />
      
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ar" element={<ArMaintenancePage />} />
        <Route path="/check-tools" element={<CheckToolsPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;