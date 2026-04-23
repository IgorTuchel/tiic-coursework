import { LuUser, LuEllipsis } from "react-icons/lu";
import { StatusBadge } from "./StatusBadge.jsx";
import { resolveMfa, initials } from "../../utils/utils.js";

export function UserTable({ users, roles, loading, onActionClick }) {
  if (loading)
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-500" />
        Loading users...
      </div>
    );

  if (users.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-500">
        <LuUser className="w-8 h-8 text-slate-700" />
        <p className="text-sm">No users found.</p>
      </div>
    );

  return (
    <table className="w-full text-sm">
      <thead className="bg-slate-900 border-b border-slate-800">
        <tr>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
            Name
          </th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 hidden sm:table-cell">
            Email
          </th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 hidden md:table-cell">
            Role
          </th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 hidden md:table-cell">
            Status
          </th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 hidden lg:table-cell">
            MFA
          </th>
          <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 hidden lg:table-cell">
            Created
          </th>
          <th className="px-4 py-3 w-10" />
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800 bg-slate-950">
        {users.map((u) => {
          const mfa = resolveMfa(u, roles);
          return (
            <tr key={u.userID} className="hover:bg-slate-900 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-sky-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                    {initials(u)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-slate-400 sm:hidden">
                      {u.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-300 hidden sm:table-cell">
                {u.email}
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-xs text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full">
                  {u.role?.roleName ?? "—"}
                </span>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <StatusBadge status={u.status?.statusName} />
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                <span
                  className={`text-xs ${mfa.active ? "text-emerald-400" : "text-slate-500"}`}>
                  {mfa.active ? "Enabled" : "Disabled"}
                  {mfa.source !== "none" && (
                    <span className="ml-1 text-slate-600">({mfa.source})</span>
                  )}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <button
                    onClick={() => onActionClick(u)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="User actions">
                    <LuEllipsis className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
