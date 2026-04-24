import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getMaintenanceReportById,
  getAllTools,
  getReportStatuses,
  getSeverityLevels,
  getAssignableUsers,
} from "../services/maintenanceReports";

export function useMaintenanceDetail(id, canAssign) {
  const [report, setReport] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableTools, setAvailableTools] = useState([]);
  const [reportStatuses, setReportStatuses] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isArSupported, setArSupported] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const [reportResult, toolsResult, statusesResult, severitiesResult] =
        await Promise.all([
          getMaintenanceReportById(id),
          getAllTools(),
          getReportStatuses(),
          getSeverityLevels(),
        ]);

      if (reportResult.success) setReport(reportResult.data);
      else toast.error(reportResult.message || "Failed to load report.");

      if (toolsResult.success) setAvailableTools(toolsResult.data);
      else toast.error(toolsResult.message || "Failed to load tools.");

      if (statusesResult.success) setReportStatuses(statusesResult.data);
      else toast.error(statusesResult.message || "Failed to load statuses.");

      if (severitiesResult.success) setSeverityLevels(severitiesResult.data);
      else
        toast.error(severitiesResult.message || "Failed to load severities.");

      navigator.xr?.isSessionSupported("immersive-ar").then((supported) => {
        if (supported) setArSupported(true);
      });

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
    availableTools,
    reportStatuses,
    severityLevels,
    loading,
    isArSupported,
  };
}
