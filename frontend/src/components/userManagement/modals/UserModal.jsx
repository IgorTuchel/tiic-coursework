import { useState } from "react";
import { Modal } from "../../Modal.jsx";
import { inputCls, labelCls } from "../utils.js";

export function UserModal({
  mode,
  user,
  roles,
  statuses,
  onSubmit,
  onClose,
  onBack,
}) {
  const isPending = user?.status?.statusName === "pending";

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    roleID: user?.role?.roleID ?? "",
    statusID: user?.status?.statusID ?? "",
  });
  const [submitting, setSubmitting] = useState(false);

  const selectedRole = roles.find((r) => r.roleID === form.roleID);
  const mfaState = (() => {
    if (selectedRole?.mfaRequired)
      return { label: "Required by role", color: "text-emerald-400" };
    if (mode === "edit" && user?.mfaEnabled)
      return { label: "Enabled by user", color: "text-emerald-400" };
    return { label: "Not required", color: "text-slate-500" };
  })();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload =
      mode === "create"
        ? {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            roleID: form.roleID,
          }
        : {
            firstName: form.firstName,
            lastName: form.lastName,
            roleID: form.roleID,
            statusID: form.statusID,
          };
    await onSubmit(payload);
    setSubmitting(false);
  };

  const editableStatuses = statuses.filter((s) => s.statusName !== "pending");

  return (
    <Modal
      title={mode === "create" ? "Create user" : "Edit user"}
      subtitle={mode === "edit" ? user.email : undefined}
      onClose={onClose}
      onBack={onBack}
      maxWidth="max-w-sm"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button
            form="user-form"
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-60 px-3 py-2 text-sm font-medium text-slate-950 transition-colors">
            {submitting
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create user"
                : "Save changes"}
          </button>
        </div>
      }>
      <form id="user-form" onSubmit={handleSubmit} className="space-y-3">
        {mode === "edit" && isPending && (
          <div className="rounded-md bg-yellow-400/10 border border-yellow-400/20 px-3 py-2 text-xs text-yellow-300">
            ⚠ Account is{" "}
            <span className="font-medium">pending registration</span> — status
            cannot be changed yet.
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>First name</label>
            <input
              name="firstName"
              required
              value={form.firstName}
              onChange={handleChange}
              placeholder="Jane"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Last name</label>
            <input
              name="lastName"
              required
              value={form.lastName}
              onChange={handleChange}
              placeholder="Smith"
              className={inputCls}
            />
          </div>
        </div>
        {mode === "create" && (
          <div>
            <label className={labelCls}>Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="jane@company.com"
              className={inputCls}
            />
          </div>
        )}
        <div>
          <label className={labelCls}>Role</label>
          <select
            name="roleID"
            required
            value={form.roleID}
            onChange={handleChange}
            className={inputCls}>
            <option value="" disabled>
              Select a role...
            </option>
            {roles.map((r) => (
              <option key={r.roleID} value={r.roleID}>
                {r.roleName}
              </option>
            ))}
          </select>
        </div>
        {form.roleID && (
          <div className="flex items-center justify-between rounded-md bg-slate-900/60 border border-slate-700/50 px-3 py-2">
            <span className="text-xs text-slate-400">MFA status</span>
            <span className={`text-xs font-medium ${mfaState.color}`}>
              {mfaState.label}
            </span>
          </div>
        )}
        {mode === "edit" && (
          <div>
            <label className={labelCls}>Status</label>
            <select
              name="statusID"
              required
              value={form.statusID}
              onChange={handleChange}
              disabled={isPending}
              className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}>
              <option value="" disabled>
                Select a status...
              </option>
              {(isPending ? statuses : editableStatuses).map((s) => (
                <option key={s.statusID} value={s.statusID}>
                  {s.statusName}
                </option>
              ))}
            </select>
          </div>
        )}
        {mode === "create" && (
          <p className="text-xs text-slate-500">
            Account starts as <span className="text-yellow-400">pending</span>.
            The user will receive a registration email.
          </p>
        )}
      </form>
    </Modal>
  );
}
