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
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [availableTools, setAvailableTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    const result = await getAllMaintenanceReports(page, limit);

    if (result.success) {
      setReports(result.data);
      setPagination(result.pagination);
    } else {
      toast.error(result.message ?? "Failed to fetch maintenance reports.");
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchReports();
    };
    fetchData();
  }, [page, limit]);

  useEffect(() => {
    getSeverityLevels().then((r) => {
      if (r.success) setSeverityLevels(r.data);
    });
    getAllTools().then((r) => {
      if (r.success) setAvailableTools(r.data);
    });
  }, []);

  const handlePageChange = (newPage) => setPage(newPage);
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

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
    pagination,
    limit,
    severityLevels,
    availableTools,
    loading,
    refreshing,
    fetchReports,
    handleCreate,
    handlePageChange,
    handleLimitChange,
  };
}
