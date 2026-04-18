export function initials(u) {
  return (
    [u?.firstName?.[0], u?.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?"
  );
}

export function normaliseUser(u) {
  if (!u) return u;
  return {
    ...u,
    role: Array.isArray(u.role)
      ? { roleName: u.role[0], roleID: u.role[1] }
      : u.role,
    status: Array.isArray(u.status)
      ? { statusName: u.status[0], statusID: u.status[1] }
      : u.status,
  };
}

export function resolveMfa(user, roles) {
  const fullRole =
    roles.find((r) => r.roleID === user?.role?.roleID) ?? user?.role;
  if (fullRole?.mfaRequired) return { active: true, source: "role" };
  if (user?.mfaEnabled) return { active: true, source: "user" };
  return { active: false, source: "none" };
}

export const PERM_LABELS = {
  isAdmin: "Administrator",
  canManageUsers: "Manage users",
  canViewAllUsers: "View all users",
  canManageRoles: "Manage roles",
  canViewSecurityLogs: "View security logs",
  canViewActivityLogs: "View activity logs",
  canViewAllReports: "View all reports",
  canAssignReports: "Assign reports",
  canManageReports: "Manage reports",
  canManageTools: "Manage tools",
  canWorkOnReports: "Work on reports",
  canSuggestFaults: "Suggest faults",
  canManageFaults: "Manage faults",
  canViewAllFaults: "View all faults",
  canAssignFaults: "Assign faults",
  mfaRequired: "MFA required",
};

export const inputCls =
  "w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500";

export const labelCls = "block text-xs font-medium text-slate-300 mb-1";
