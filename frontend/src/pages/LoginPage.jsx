import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuShield,
  LuEye,
  LuEyeOff,
  LuLoader,
  LuChevronLeft,
} from "react-icons/lu";
import { AuthContext } from "../context/AuthContext";
import { useLoginForm } from "../hooks/useLoginForm";
import { inputCls } from "../utils/styles";
import AuthLayout from "../layouts/AuthLayout";

function MfaStep({
  form,
  loading,
  handleChange,
  handleSubmit,
  handleBackToLogin,
}) {
  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
          <LuShield className="w-8 h-8 text-sky-400" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-1 text-center">
        Two-factor authentication
      </h2>
      <p className="text-sm text-slate-400 mb-6 text-center">
        Enter the 6-digit code emailed to you.
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
              <LuLoader className="animate-spin w-4 h-4 mr-2" />
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
          <LuChevronLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </button>
      </form>

      <p className="mt-6 text-xs text-slate-500 text-center">
        Lost access to your email? Contact your administrator for help.
      </p>
    </>
  );
}

function LoginStep({
  form,
  loading,
  visiblePass,
  setVisiblePass,
  handleChange,
  handleSubmit,
}) {
  return (
    <>
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
            className={inputCls}
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
              to="/reset-password"
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
              className={inputCls}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setVisiblePass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
              {visiblePass ? (
                <LuEyeOff className="w-4 h-4" />
              ) : (
                <LuEye className="w-4 h-4" />
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
              <LuLoader className="animate-spin w-4 h-4 mr-2" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        <p className="text-xs text-slate-500">
          New user?{" "}
          <Link
            to="/activate-account"
            className="text-sky-400 hover:text-sky-300 transition-colors">
            Activate your account
          </Link>
        </p>
        <p className="text-xs text-slate-500">
          By signing in you agree to abide by the maintenance and safety
          procedures for AR tooling.
        </p>
      </div>
    </>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useContext(AuthContext);

  const {
    form,
    mfaRequired,
    visiblePass,
    setVisiblePass,
    handleChange,
    handleSubmit,
    handleBackToLogin,
  } = useLoginForm();

  useEffect(() => {
    if (isAuthenticated) navigate("/app/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout
      title="Login"
      panelHeading="Maintenance Console"
      panelBody="Secure access for authorised maintenance staff. Monitor active faults, schedule interventions, and keep tool kits in top shape from a single pane of glass.">
      {loading && !isAuthenticated && !mfaRequired ? (
        <div className="text-center">
          <LuLoader className="animate-spin w-12 h-12 text-sky-500 mx-auto mb-4" />
          <p className="text-slate-400">Checking authentication...</p>
        </div>
      ) : mfaRequired ? (
        <MfaStep
          form={form}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleBackToLogin={handleBackToLogin}
        />
      ) : (
        <LoginStep
          form={form}
          loading={loading}
          visiblePass={visiblePass}
          setVisiblePass={setVisiblePass}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}
    </AuthLayout>
  );
}

export default LoginPage;
