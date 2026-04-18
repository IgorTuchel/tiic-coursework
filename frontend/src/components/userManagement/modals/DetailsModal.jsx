import { Modal } from "../../Modal.jsx";
import { PERM_LABELS, resolveMfa } from "../utils.js";

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="rounded-md bg-slate-900 border border-slate-700/50 divide-y divide-slate-700/50">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = "text-slate-300" }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 gap-4">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className={`text-xs font-mono text-right break-all ${valueClass}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export function DetailsModal({ user, roles, onClose, onBack }) {
  const fullRole =
    roles.find((r) => r.roleID === user.role?.roleID) ?? user.role ?? {};
  const mfa = resolveMfa(user, roles);
  const statusColor =
    user.status?.statusName === "active"
      ? "text-emerald-400"
      : user.status?.statusName === "pending"
        ? "text-yellow-400"
        : user.status?.statusName === "suspended"
          ? "text-red-400"
          : "text-slate-400";

  return (
    <Modal
      title="User details"
      subtitle={`${user.firstName} ${user.lastName} · ${user.email}`}
      onClose={onClose}
      onBack={onBack}
      maxWidth="max-w-md"
      footer={
        <button
          onClick={onClose}
          className="w-full rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
          Close
        </button>
      }>
      <div className="space-y-4 max-h-[32rem] overflow-y-auto -mx-1 px-1">
        <Section title="Account">
          <Row label="User ID" value={user.userID} />
          <Row label="First name" value={user.firstName} />
          <Row label="Last name" value={user.lastName} />
          <Row label="Email" value={user.email} />
          <Row
            label="Status"
            value={user.status?.statusName}
            valueClass={statusColor}
          />
          <Row label="Status ID" value={user.status?.statusID} />
          <Row
            label="Created"
            value={
              user.createdAt ? new Date(user.createdAt).toLocaleString() : null
            }
          />
          <Row
            label="Updated"
            value={
              user.updatedAt ? new Date(user.updatedAt).toLocaleString() : null
            }
          />
        </Section>
        <Section title="Role">
          <Row label="Role ID" value={fullRole.roleID} />
          <Row
            label="Role name"
            value={fullRole.roleName}
            valueClass="text-sky-400"
          />
          {Object.entries(PERM_LABELS).map(([key, label]) => (
            <Row
              key={key}
              label={label}
              value={fullRole[key] ? "Yes" : "No"}
              valueClass={fullRole[key] ? "text-emerald-400" : "text-slate-500"}
            />
          ))}
        </Section>
        <Section title="Security">
          <Row
            label="MFA active"
            value={mfa.active ? `Yes (${mfa.source})` : "No"}
            valueClass={mfa.active ? "text-emerald-400" : "text-slate-500"}
          />
          <Row
            label="MFA enabled (user)"
            value={user.mfaEnabled ? "Yes" : "No"}
            valueClass={user.mfaEnabled ? "text-emerald-400" : "text-slate-500"}
          />
          <Row
            label="MFA required (role)"
            value={fullRole.mfaRequired ? "Yes" : "No"}
            valueClass={
              fullRole.mfaRequired ? "text-emerald-400" : "text-slate-500"
            }
          />
        </Section>
      </div>
    </Modal>
  );
}
