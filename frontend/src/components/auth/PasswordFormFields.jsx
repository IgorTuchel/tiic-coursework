import { LuEye, LuEyeOff } from "react-icons/lu";
import { PasswordRules } from "./PasswordRules";

function PasswordFormFields({
  password,
  setPassword,
  showPass,
  setShowPass,
  rules,
  allValid,
  submitting,
  label = "Password",
  placeholder = "Create a strong password",
  submitLabel = "Submit",
  submittingLabel = "Submitting…",
}) {
  return (
    <>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-200 mb-1">
          {label}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPass ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 pr-10 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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

      {password.length > 0 && <PasswordRules rules={rules} />}

      <button
        type="submit"
        disabled={submitting || !allValid}
        className="w-full inline-flex items-center justify-center rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed px-3 py-2.5 text-sm font-medium text-slate-950 transition-colors">
        {submitting ? submittingLabel : submitLabel}
      </button>
    </>
  );
}

export default PasswordFormFields;
