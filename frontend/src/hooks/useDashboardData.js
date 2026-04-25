import { useEffect, useState } from "react";
import {
  getFaultReportCount,
  getAllFaultReportCount,
  getAssignedFaultReports,
  getMaintenanceReportCount,
  getAllMaintenanceReportCount,
  getAssignedMaintenanceReports,
} from "../services/getInfoService";

export function getOpen(result, type) {
  if (!result?.data) return undefined;
  return type === "fault"
    ? result.data.openFaultReportCount
    : result.data.openMaintenanceReportCount;
}

export function getClosed(result, type) {
  if (!result?.data) return undefined;
  return type === "fault"
    ? result.data.closedFaultReportCount
    : result.data.closedMaintenanceReportCount;
}

export function useDashboardData({
  canSeeFaults,
  canSeeAllFaults,
  canSeeReports,
  canSeeAllReports,
}) {
  const [loading, setLoading] = useState(true);
  const [myFaults, setMyFaults] = useState(null);
  const [allFaults, setAllFaults] = useState(null);
  const [myMaintenance, setMyMaintenance] = useState(null);
  const [allMaintenance, setAllMaintenance] = useState(null);
  const [assignedFaults, setAssignedFaults] = useState([]);
  const [assignedMaintenance, setAssignedMaintenance] = useState([]);

  const fetchData = async () => {
    setLoading(true);

    const calls = [
      canSeeFaults ? getFaultReportCount() : Promise.resolve(null),
      canSeeReports ? getMaintenanceReportCount() : Promise.resolve(null),
      canSeeFaults ? getAssignedFaultReports() : Promise.resolve(null),
      canSeeReports ? getAssignedMaintenanceReports() : Promise.resolve(null),
      ...(canSeeAllFaults ? [getAllFaultReportCount()] : []),
      ...(canSeeAllReports ? [getAllMaintenanceReportCount()] : []),
    ];

    const [myF, myM, asF, asM, ...rest] = await Promise.all(calls);

    if (myF?.success) setMyFaults(myF);
    if (myM?.success) setMyMaintenance(myM);
    if (asF?.success) setAssignedFaults(asF.data ?? []);
    if (asM?.success) setAssignedMaintenance(asM.data ?? []);

    let i = 0;
    if (canSeeAllFaults) {
      if (rest[i]?.success) setAllFaults(rest[i]);
      i++;
    }
    if (canSeeAllReports) {
      if (rest[i]?.success) setAllMaintenance(rest[i]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignedTotal =
    (assignedFaults?.length ?? 0) + (assignedMaintenance?.length ?? 0);

  return {
    loading,
    fetchData,
    myFaults,
    allFaults,
    myMaintenance,
    allMaintenance,
    assignedFaults,
    assignedMaintenance,
    assignedTotal,
  };
}
