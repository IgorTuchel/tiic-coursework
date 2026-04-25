import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useDashboardPermissions() {
  const { user } = useContext(AuthContext);
  const p = user?.roleInfo ?? {};

  const canSeeFaults = !!(
    p.isAdmin ||
    p.canSuggestFaults ||
    p.canManageFaults ||
    p.canViewAllFaults ||
    p.canAssignFaults
  );

  const canSeeAllFaults = !!(
    p.isAdmin ||
    p.canViewAllFaults ||
    p.canManageFaults
  );

  const canSeeReports = !!(
    p.isAdmin ||
    p.canWorkOnReports ||
    p.canViewAllReports ||
    p.canManageReports ||
    p.canAssignReports
  );

  const canSeeAllReports = !!(
    p.isAdmin ||
    p.canViewAllReports ||
    p.canManageReports
  );

  const isPrivileged = canSeeAllFaults || canSeeAllReports;

  return {
    canSeeFaults,
    canSeeAllFaults,
    canSeeReports,
    canSeeAllReports,
    isPrivileged,
  };
}
