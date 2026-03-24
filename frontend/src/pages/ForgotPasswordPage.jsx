// src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api"
import logo from '../assets/hero.png';


function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: replace with real backend route, e.g. POST /api/users/forgot-password
      await api.get("/ping");
      toast.success("If that account exists, a reset link has been sent.");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to request reset";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
          Reset your maintenance console password.
        </p>
        <p className="max-w-md text-slate-900/80">
          Use your work email address and we will send a secure link to create
          a new password.
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

          <h2 className="text-2xl font-semibold mb-1">Reset password</h2>
          <p className="text-sm text-slate-400 mb-6">
            Enter your work email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="tech.ops@company.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60 px-3 py-2 text-sm font-medium text-slate-950 transition-colors"
            >
              {loading ? "Sending link..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500">
            Remembered your password?{" "}
            <Link to="/" className="text-sky-400 hover:text-sky-300">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
