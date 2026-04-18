// src/pages/LoginPage.jsx
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../services/loginUserService";
import { AuthContext } from "../context/AuthContext";
import { validateEmail, validatePassword } from "../../utils/validator";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", mfaCode: "" });
  const [mfaRequired, setMfaRequired] = useState(false);
  const [visiblePass, setVisiblePass] = useState(false);
  const { loading, setIsAuthenticated, isAuthenticated, setLoading } =
    useContext(AuthContext);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const loginFlow = async () => {
    setLoading(true);
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    const validPass = validatePassword(form.password);
    if (!validPass.valid) {
      toast.error(validPass.reason);
      setLoading(false);
      return;
    }

    const res = await login(form.email, form.password, form.mfaCode);

    if (res.mfaRequired) {
      setMfaRequired(true);
      setLoading(false);
      if (!mfaRequired) {
        toast.success("Enter your MFA code to continue.");
      } else {
        toast.error("Invalid MFA code. Please try again.");
        setForm((f) => ({ ...f, mfaCode: "" }));
      }
      return;
    }

    if (!res.success) {
      toast.error(
        res.message || "Login failed. Please check your credentials.",
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    setIsAuthenticated(true);
    toast.success("Successfully logged in!");
    navigate(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginFlow();
  };

  const handleBackToLogin = () => {
    setMfaRequired(false);
    setForm((f) => ({ ...f, mfaCode: "" }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const Logo = ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <title>Login - Inspectra Maintenance Console</title>
      {/* Desktop Left Panel */}
      <div className="hidden md:flex w-1/2 flex-col justify-center bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 p-10">
        <div className="flex items-center gap-4 mb-6">
          <Logo className="w-12 h-12 text-slate-900" />
          <h1 className="text-4xl font-semibold text-slate-900 tracking-wide uppercase">
            Inspectra
          </h1>
        </div>
        <p className="text-slate-900/80 text-lg mb-8">Maintenance Console</p>
        <p className="max-w-md text-slate-900/80">
          Secure access for authorised maintenance staff. Monitor active faults,
          schedule interventions, and keep tool kits in top shape from a single
          pane of glass.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        {/* Auth check spinner */}
        {loading && !isAuthenticated && !mfaRequired ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4" />
            <p className="text-slate-400">Checking authentication...</p>
          </div>
        ) : mfaRequired ? (
          /* ── MFA Step ── */
          <div className="w-full max-w-md">
            <div className="mb-8 md:hidden">
              <div className="flex items-center gap-3 mb-3">
                <Logo className="w-10 h-10 text-sky-500" />
                <h1 className="text-3xl font-semibold text-slate-100 tracking-wide uppercase">
                  Inspectra
                </h1>
              </div>
              <p className="text-slate-400 text-sm">Maintenance Console</p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-sky-400">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-1 text-center">
              Two-factor authentication
            </h2>
            <p className="text-sm text-slate-400 mb-6 text-center">
              Enter the 6-digit code from your authenticator app.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="mfaCode"
                  className="block text-sm font-medium text-slate-200 mb-1">
                  Authentication code
                </label>
                <input
                  id="mfaCode"
                  name="mfaCode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  autoFocus
                  autoComplete="one-time-code"
                  value={form.mfaCode}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-3 text-center tracking-[0.5em] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder:tracking-normal"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || form.mfaCode.length !== 6}
                className="w-full inline-flex items-center justify-center rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60 px-3 py-2 text-sm font-medium text-slate-950 transition-colors">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950 mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full inline-flex items-center justify-center rounded-md border border-slate-700 hover:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition-colors">
                ← Back to sign in
              </button>
            </form>

            <p className="mt-6 text-xs text-slate-500 text-center">
              Lost access to your authenticator? Contact your system
              administrator.
            </p>
          </div>
        ) : (
          /* ── Login Step ── */
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="mb-8 md:hidden">
              <div className="flex items-center gap-3 mb-3">
                <Logo className="w-10 h-10 text-sky-500" />
                <h1 className="text-3xl font-semibold text-slate-100 tracking-wide uppercase">
                  Inspectra
                </h1>
              </div>
              <p className="text-slate-400 text-sm">Maintenance Console</p>
            </div>

            <h2 className="text-2xl font-semibold mb-1">Sign in</h2>
            <p className="text-sm text-slate-400 mb-6">
              Use your work email and maintenance console password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-200 mb-1">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="tech.ops@company.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-sky-400 hover:text-sky-300">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={visiblePass ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setVisiblePass((v) => !v)}
                    className="absolute right-3 top-[calc(50%-0.5em)] text-slate-500 hover:text-slate-300 transition-opacity">
                    {visiblePass ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4">
                        <path d="M1 1l22 22M17.94 17.94A10.05 10.05 0 0 1 12 19c-5.05 0-9.27-3.16-11-7.5a10.05 10.05 0 0 1 4.11-4.11M9.88 9.88A3 3 0 1 0 14.12 14.12" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60 px-3 py-2 text-sm font-medium text-slate-950 transition-colors">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950 mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="mt-6 text-xs text-slate-500">
              By signing in you agree to abide by the maintenance and safety
              procedures for AR tooling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
