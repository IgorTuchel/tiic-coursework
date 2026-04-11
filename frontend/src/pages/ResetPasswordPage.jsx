// src/pages/ResetPasswordPage.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Reset Password | Inspectra";
  }, []);

  // Password Strength Calculation 
  const calculateStrength = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score; 
  };

  const strength = calculateStrength(password);

  const getStrengthBarWidth = () => {
    if (strength === 0) return "w-0";
    if (strength === 1) return "w-1/4";
    if (strength === 2) return "w-2/4";
    if (strength === 3) return "w-3/4";
    return "w-full";
  };

  const getStrengthColor = () => {
    if (strength <= 1) return "bg-rose-500";
    if (strength === 2) return "bg-amber-400";
    return "bg-emerald-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with real backend route, e.g. POST /api/users/reset-password
      await api.get("/ping");
      toast.success("Password updated. You can now sign in.");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Failed to reset password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const tokenMissing = !token;

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <div className="hidden md:flex w-1/2 flex-col justify-center bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 p-10">
        <div className="flex items-center gap-4 mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-slate-900">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <h1 className="text-4xl font-semibold text-slate-900 tracking-wide uppercase">Inspectra</h1>
        </div>
        <p className="text-slate-900/80 text-lg mb-8">Choose a new password for your maintenance console.</p>
        <p className="max-w-md text-slate-900/80">This link is tied to your work email. Keep your new password secure and do not share it.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden">
            <div className="flex items-center gap-3 mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-sky-500">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <h1 className="text-3xl font-semibold text-slate-100 tracking-wide uppercase">Inspectra</h1>
            </div>
            <p className="text-slate-400 text-sm">Maintenance Console</p>
          </div>

          <h2 className="text-2xl font-semibold mb-1">Set a new password</h2>
          <p className="text-sm text-slate-400 mb-6">Choose a strong password for your account.</p>

          {tokenMissing && (
            <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Reset token is missing or invalid. Please use the link from your reset email or request a new one.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1">New password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="At least 8 characters"
              />
              
              <div className="mt-2">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${getStrengthBarWidth()} ${getStrengthColor()}`} />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-medium">
                  <span>{strength === 0 ? "Enter password" : strength <= 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}</span>
                  {strength < 4 && password.length > 0 && <span>Add numbers & symbols</span>}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-slate-200 mb-1 mt-1">Confirm password</label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Repeat new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || tokenMissing || strength < 2}
              className="w-full inline-flex items-center justify-center rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60 px-3 py-2 text-sm font-medium text-slate-950 transition-colors mt-2"
            >
              {loading ? "Updating password..." : "Update password"}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500">Back to <Link to="/" className="text-sky-400 hover:text-sky-300">login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;