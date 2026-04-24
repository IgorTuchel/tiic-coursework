export function PasswordRules({ rules }) {
  return (
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
  );
}
