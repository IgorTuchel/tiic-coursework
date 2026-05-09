import { Modal } from "./Modal";
import { useSettingsModal } from "../hooks/useSettingsModal";

function SettingsModal({ open, onClose, user, setUser }) {
  const {
    form,
    saving,
    awaitingMfaCode,
    hasChanges,
    subtitle,
    submitLabel,
    updateField,
    toggleMfa,
    handleSubmit,
  } = useSettingsModal({ open, user, setUser, onClose });

  if (!open) return null;

  return (
    <Modal
      title="Settings"
      subtitle={subtitle}
      onClose={onClose}
      maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">
              First name
            </label>
            <input
              type="text"
              aria-label="First Name Input"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-sky-500 transition-colors"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">
              Last name
            </label>
            <input
              type="text"
              aria-label="Last Name Input"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-sky-500 transition-colors"
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Email</label>
            <div
              className="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-400"
              aria-label="User Email">
              {user?.email || "—"}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Role</label>
            <div
              className="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-400"
              aria-label="User Role">
              {user?.role || "—"}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-100">
                Multi-factor authentication
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Changing your MFA status may require email verification.
              </p>
            </div>

            <button
              type="button"
              disabled={awaitingMfaCode}
              onClick={toggleMfa}
              aria-label={form.mfaEnabled ? "Disable MFA" : "Enable MFA"}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                form.mfaEnabled ? "bg-sky-600" : "bg-slate-700"
              }`}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.mfaEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {awaitingMfaCode && (
            <div className="mt-4">
              <label className="block text-sm text-slate-300 mb-1.5">
                Verification code
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                value={form.mfaCode}
                onChange={(e) => updateField("mfaCode", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-sky-500 transition-colors"
                placeholder="Enter the code sent to your email"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors hover:border-slate-500 cursor-pointer disabled:opacity-60">
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || !hasChanges}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors disabled:opacity-60 enabled:cursor-pointer disabled:cursor-not-allowed">
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default SettingsModal;
