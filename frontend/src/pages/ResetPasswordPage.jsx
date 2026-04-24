import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import PasswordFormFields from "../components/auth/PasswordFormFields";
import { useResetPassword } from "../hooks/useResetPassword";
import { usePasswordForm } from "../hooks/usePasswordForm";

function ResetPasswordPage() {
  const {
    token,
    email,
    setEmail,
    submitting,
    handleSubmitPassword,
    handleSubmitEmail,
  } = useResetPassword();

  const {
    password,
    setPassword,
    showPass,
    setShowPass,
    rules,
    allValid,
    validate,
  } = usePasswordForm();

  return (
    <AuthLayout
      title="Reset Password"
      panelHeading="Choose a new password for your maintenance console."
      panelBody="This link is tied to your work email. Keep your new password secure and do not share it.">
      {!token ? (
        <>
          <h2 className="text-2xl font-semibold mb-1">Reset your password</h2>
          <p className="text-sm text-slate-400 mb-6">
            Enter your work email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-1">
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tech.ops@company.com"
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-sky-500 hover:bg-sky-600 px-3 py-2.5 text-sm font-medium text-slate-950 transition-colors">
              Send reset link
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-1">Set a new password</h2>
          <p className="text-sm text-slate-400 mb-6">
            Choose a strong password for your account.
          </p>

          <form
            onSubmit={(e) => handleSubmitPassword(e, { password, validate })}
            className="space-y-4">
            <PasswordFormFields
              password={password}
              setPassword={setPassword}
              showPass={showPass}
              setShowPass={setShowPass}
              rules={rules}
              allValid={allValid}
              submitting={submitting}
              label="New password"
              submitLabel="Update password"
              submittingLabel="Updating password…"
            />
          </form>
        </>
      )}

      <p className="mt-6 text-xs text-slate-500">
        Back to{" "}
        <Link to="/login" className="text-sky-400 hover:text-sky-300">
          login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
