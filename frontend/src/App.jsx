import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
}

export default App;
