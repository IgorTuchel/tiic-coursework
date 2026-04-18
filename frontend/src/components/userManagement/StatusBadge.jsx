export function StatusBadge({ status }) {
  const map = {
    active: "text-emerald-400 bg-emerald-400/10",
    pending: "text-yellow-400 bg-yellow-400/10",
    suspended: "text-red-400 bg-red-400/10",
    deactivated: "text-slate-400 bg-slate-700/50",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full capitalize ${map[status] ?? "text-slate-400 bg-slate-700/50"}`}>
      {status ?? "—"}
    </span>
  );
}
