import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getAllFaultReports,
  createFaultReport,
} from "../services/faultReports";
import { getSeverityLevels } from "../services/maintenanceReports";

export function useFaultReports() {
  const [reports, setReports] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    const result = await getAllFaultReports();

    if (result.success) setReports(result.data);
    else toast.error(result.message ?? "Failed to fetch fault reports.");

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReports();

    getSeverityLevels().then((result) => {
      if (result.success) setSeverityLevels(result.data);
    });
  }, []);

  const handleCreate = async (formData, onSuccess) => {
    const result = await createFaultReport(formData);

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
    loading,
    refreshing,
    fetchReports,
    handleCreate,
  };
}
