// src/pages/ResetPasswordPage.jsx
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api"


function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

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
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const tokenMissing = !token;

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
     <div className="hidden md:flex w-1/2 flex-col justify-center bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 p-10">
       <div className="flex items-center gap-3 mb-6">
         <img 
           src={logo} 
           alt="inseactra logo" 
           className="w-16 h-16 object-contain"
         />
         <h1 className="text-4xl font-semibold text-slate-900">inseactra</h1>
       </div>
   
        <p className="text-slate-900/80 text-lg mb-8">
          Choose a new password for your maintenance console.
        </p>
        <p className="max-w-md text-slate-900/80">
          This link is tied to your work email. Keep your new password secure
          and do not share it.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden">
            <div className="text-xs font-semibold tracking-widest text-sky-400 mb-2">
              AR
            </div>
            <h1 className="text-3xl font-semibold">Inspectra</h1>
            <p className="text-slate-400 text-sm">Maintenance Console</p>
          </div>

          <h2 className="text-2xl font-semibold mb-1">Set a new password</h2>
          <p className="text-sm text-slate-400 mb-6">
            Choose a strong password for your account.
          </p>

          {tokenMissing && (
            <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Reset token is missing or invalid. Please use the link from your
              reset email or request a new one.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                New password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Confirm password
              </label>
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
              disabled={loading || tokenMissing}
              className="w-full inline-flex items-center justify-center rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60 px-3 py-2 text-sm font-medium text-slate-950 transition-colors"
            >
              {loading ? "Updating password..." : "Update password"}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500">
            Back to{" "}
            <Link to="/" className="text-sky-400 hover:text-sky-300">
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
