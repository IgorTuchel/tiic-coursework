import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getAllMaintenanceReports,
  createMaintenanceReport,
  getSeverityLevels,
  getAllTools,
} from "../services/maintenanceReports";

export function useMaintenanceReports() {
  const [reports, setReports] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [availableTools, setAvailableTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    const result = await getAllMaintenanceReports();

    if (result.success) {
      setReports(result.data);
    } else {
      toast.error(result.message ?? "Failed to fetch maintenance reports.");
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReports();

    getSeverityLevels().then((result) => {
      if (result.success) setSeverityLevels(result.data);
    });

    getAllTools().then((result) => {
      if (result.success) setAvailableTools(result.data);
    });
  }, []);

  const handleCreate = async (formData, onSuccess) => {
    const result = await createMaintenanceReport(formData);

    if (result.success) {
      toast.success("Report created!");
      onSuccess?.();
      fetchReports({ silent: true });
    } else {
      toast.error(result.message ?? "Failed to create report.");
    }
  };

  return {
    reports,
    severityLevels,
    availableTools,
    loading,
    refreshing,
    fetchReports,
    handleCreate,
  };
}
