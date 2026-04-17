// src/pages/ForgotPasswordPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password | Inspectra";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: replace with real backend route, e.g. POST /api/users/forgot-password
      await api.get("/ping");
      toast.success("If that email is registered, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      toast.error("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      
      {/* Desktop Left Side */}
      <div className="hidden md:flex w-1/2 flex-col justify-center bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 p-10">
        <div className="flex items-center gap-4 mb-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-12 h-12 text-slate-900"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <h1 className="text-4xl font-semibold text-slate-900 tracking-wide uppercase">
            Inspectra
          </h1>
        </div>

        <p className="text-slate-900/80 text-lg mb-8">
          Account Recovery
        </p>
        <p className="max-w-md text-slate-900/80">
          Enter your work email address to receive a secure password reset link. 
          If you continue to experience issues, contact the System Administrator.
        </p>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden">
            <div className="flex items-center gap-3 mb-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 text-sky-500"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <h1 className="text-3xl font-semibold text-slate-100 tracking-wide uppercase">
                Inspectra
              </h1>
            </div>
            <p className="text-slate-400 text-sm">Account Recovery</p>
          </div>

          <h2 className="text-2xl font-semibold mb-1">Reset your password</h2>
          <p className="text-sm text-slate-400 mb-6">
            Enter your work email and we will send you a reset link.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1">
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
            Back to <Link to="/" className="text-sky-400 hover:text-sky-300">login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;