import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import PasswordFormFields from "../components/auth/PasswordFormFields";
import { useActivateAccount } from "../hooks/useActivateAccount";
import { usePasswordForm } from "../hooks/usePasswordForm";

function ActivateAccountPage() {
  const {
    token,
    email,
    setEmail,
    submitting,
    handleSubmitPassword,
    handleSubmitEmail,
  } = useActivateAccount();

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
      title="Activate Account"
      panelHeading="Welcome to the maintenance console."
      panelBody="Please activate your account to access the maintenance console and start managing your tasks. If you haven't received an activation email, you can request a new one below.">
      {!token ? (
        <>
          <h2 className="text-2xl font-semibold mb-1">Activate your account</h2>
          <p className="text-sm text-slate-400 mb-6">
            Please check your email for a account activation link or request a
            new one below.
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
              Resend activation email
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-1">Activate your account</h2>
          <p className="text-sm text-slate-400 mb-6">
            Choose a password to get started.
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
              label="Password"
              submitLabel="Activate account"
              submittingLabel="Activating…"
            />
          </form>
        </>
      )}

      <p className="mt-6 text-xs text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="text-sky-400 hover:text-sky-300">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ActivateAccountPage;
