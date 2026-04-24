import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getFaultReportById,
  getAssignableUsers,
} from "../services/faultReports";
import {
  getReportStatuses,
  getSeverityLevels,
} from "../services/maintenanceReports";

export function useFaultDetail(id, canAssign) {
  const [report, setReport] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [reportStatuses, setReportStatuses] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [reportResult, statusesResult, severitiesResult] =
        await Promise.all([
          getFaultReportById(id),
          getReportStatuses(),
          getSeverityLevels(),
        ]);

      if (reportResult.success) setReport(reportResult.data);
      else toast.error(reportResult.message || "Failed to load report.");

      if (statusesResult.success) setReportStatuses(statusesResult.data);
      else toast.error(statusesResult.message || "Failed to load statuses.");

      if (severitiesResult.success) setSeverityLevels(severitiesResult.data);
      else
        toast.error(severitiesResult.message || "Failed to load severities.");

      setLoading(false);
    };

    if (canAssign) {
      getAssignableUsers().then((res) => {
        if (res.success) setAvailableUsers(res.data);
        else toast.error(res.message || "Failed to load users.");
      });
    }

    fetchAll();
  }, [id, canAssign]);

  return {
    report,
    setReport,
    availableUsers,
    reportStatuses,
    severityLevels,
    loading,
  };
}
