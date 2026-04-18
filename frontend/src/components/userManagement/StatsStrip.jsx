export function StatsStrip({ users, roles }) {
  const active = users.filter((u) => u.status?.statusName === "active").length;
  const inactive = users.filter(
    (u) => u.status?.statusName !== "active",
  ).length;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Total users", value: users.length, color: "text-slate-100" },
        { label: "Active", value: active, color: "text-emerald-400" },
        { label: "Inactive", value: inactive, color: "text-slate-400" },
        { label: "Roles", value: roles.length, color: "text-sky-400" },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          className="rounded-lg bg-slate-900 border border-slate-800 px-4 py-3">
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className={`text-2xl font-semibold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
