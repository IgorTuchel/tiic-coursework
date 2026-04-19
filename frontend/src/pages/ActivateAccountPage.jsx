// src/pages/ActivateAccountPage.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { passwordRules, validatePassword } from "../utils/validator";
import { LuEye, LuEyeOff, LuCheck } from "react-icons/lu";
import { activateAccount } from "../services/activateAccountService";
import toast from "react-hot-toast";
import { login } from "../services/loginUserService";

function ActivateAccountPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("id");

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const rules = passwordRules().map((r) => ({
    label: r.label,
    ok: r.test(password),
  }));

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const check = validatePassword(password);
    if (!check.valid) {
      toast.error(check.reason);
      return;
    }
    if (!token) {
      toast.error("Invalid activation link.");
      return;
    }

    setSubmitting(true);
    const result = await activateAccount(token, password);
    setSubmitting(false);

    if (result.success) {
      toast.success("Account activated successfully! Redirecting to login...");
      navigate("/login", { replace: true });
    } else {
      toast.error(
        result.error?.error || "Activation failed. Please try again.",
      );
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const res = await login(email, "dummyPassword");
    if (res.statusCode === "LOGIN_FAILURE_ACCOUNT_NOT_SETUP") {
      toast.success("Please check your email for the activation link.");
    } else {
      toast.error(
        "Account not found or already activated. Please check your email or try logging in.",
      );
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold text-slate-100">
              Invalid activation link
            </h1>
            <p className="text-sm text-slate-400">
              Please check your email for the correct activation link or enter
              your email below to resend the activation instructions.
            </p>
            <div className="mt-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                className="mt-2 w-full rounded-md bg-sky-500 hover:bg-sky-600 px-3 py-2.5 text-sm font-medium text-slate-950 transition-colors"
                onClick={handleSubmitEmail}
                aria-label="Resend activation email">
                Resend Activation Email
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-sky-500 hover:text-sky-400 transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-slate-100">
            Activate your account
          </h1>
          <p className="text-sm text-slate-400">
            Choose a password to get started.
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 space-y-5">
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Create a strong password"
                  required
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 pr-10 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}>
                  {showPass ? (
                    <LuEyeOff className="w-4 h-4" />
                  ) : (
                    <LuEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {password.length > 0 && (
              <ul className="space-y-1">
                {rules.map(({ label, ok }) => (
                  <li
                    key={label}
                    className={`flex items-center gap-2 text-xs transition-colors ${ok ? "text-emerald-400" : "text-slate-500"}`}>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${ok ? "bg-emerald-400" : "bg-slate-600"}`}
                    />
                    {label}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2.5 text-sm font-medium text-slate-950 transition-colors">
              {submitting ? "Activating…" : "Activate account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-sky-500 hover:text-sky-400 transition-colors">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default ActivateAccountPage;
