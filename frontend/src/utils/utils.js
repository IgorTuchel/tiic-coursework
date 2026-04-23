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

export const QUICK_FILTERS = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
];

export const SEVERITY_ORDER = { low: 1, medium: 2, high: 3, critical: 4 };

export function sortReports(reports, sortKey) {
  const sorted = [...reports];

  switch (sortKey) {
    case "date_desc":
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

    case "date_asc":
      return sorted.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );

    case "severity_desc":
      return sorted.sort((a, b) => {
        const aVal =
          SEVERITY_ORDER[a.severityLevel?.severityLevelName?.toLowerCase()] ??
          0;
        const bVal =
          SEVERITY_ORDER[b.severityLevel?.severityLevelName?.toLowerCase()] ??
          0;
        return bVal - aVal;
      });

    case "severity_asc":
      return sorted.sort((a, b) => {
        const aVal =
          SEVERITY_ORDER[a.severityLevel?.severityLevelName?.toLowerCase()] ??
          0;
        const bVal =
          SEVERITY_ORDER[b.severityLevel?.severityLevelName?.toLowerCase()] ??
          0;
        return aVal - bVal;
      });

    case "status":
      return sorted.sort((a, b) =>
        (a.reportStatus?.statusName ?? "").localeCompare(
          b.reportStatus?.statusName ?? "",
        ),
      );

    case "creator":
      return sorted.sort((a, b) => {
        const aName = a.createdByUser
          ? `${a.createdByUser.firstName} ${a.createdByUser.lastName}`
          : "";
        const bName = b.createdByUser
          ? `${b.createdByUser.firstName} ${b.createdByUser.lastName}`
          : "";
        return aName.localeCompare(bName);
      });

    case "name":
      return sorted.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

    default:
      return sorted;
  }
}

export function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function getSearchBlob(report) {
  const creator = report.createdByUser
    ? `${report.createdByUser.firstName} ${report.createdByUser.lastName}`
    : "";

  const severity = report.severityLevel?.severityLevelName ?? "";
  const status = report.reportStatus?.statusName ?? "";

  return normalize(
    [
      report.name,
      report.description,
      creator,
      severity,
      status,
      report.faultReportID,
    ].join(" "),
  );
}

export function matchesQuickFilter(report, filterKey) {
  if (!filterKey || filterKey === "all") return true;

  const severity = normalize(report.severityLevel?.severityLevelName);
  const status = normalize(report.reportStatus?.statusName);

  return severity === filterKey || status === filterKey;
}
