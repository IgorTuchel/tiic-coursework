import { LuCheck, LuMinus } from "react-icons/lu";
import { Modal } from "../../Modal.jsx";
import { PERM_LABELS } from "../../../utils/utils.js";

export function RoleModal({ user, roles, onClose, onBack }) {
  const fullRole =
    roles.find((r) => r.roleID === user.role?.roleID) ?? user.role ?? {};
  const permissions = Object.entries(PERM_LABELS).map(([key, label]) => ({
    key,
    label,
    value: fullRole[key] ?? false,
  }));
  const granted = permissions.filter((p) => p.value);
  const denied = permissions.filter((p) => !p.value);

  return (
    <Modal
      title="Role permissions"
      subtitle={
        <>
          <span>
            {user.firstName} {user.lastName}
          </span>
          <span className="mx-1.5 text-slate-600">·</span>
          <span className="text-sky-400">{fullRole.roleName ?? "—"}</span>
        </>
      }
      onClose={onClose}
      onBack={onBack}
      footer={
        <button
          onClick={onClose}
          className="w-full rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
          Close
        </button>
      }>
      <div className="max-h-80 overflow-y-auto space-y-4 -mx-1 px-1">
        {granted.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Granted ({granted.length})
            </p>
            {granted.map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between py-1.5 border-b border-slate-700/40">
                <span className="text-sm text-slate-300">{label}</span>
                <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        )}
        {denied.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Not granted ({denied.length})
            </p>
            {denied.map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between py-1.5 border-b border-slate-700/40">
                <span className="text-sm text-slate-500">{label}</span>
                <LuMinus className="w-4 h-4 text-slate-600 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
