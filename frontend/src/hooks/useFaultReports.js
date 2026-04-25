import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getAllFaultReports,
  createFaultReport,
} from "../services/faultReports";

import { getSeverityLevels } from "../services/maintenanceReports";

export function useFaultReports() {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    const result = await getAllFaultReports(page, limit);

    if (result.success) {
      setReports(result.data);
      setPagination(result.pagination);
    } else {
      toast.error(result.message ?? "Failed to fetch fault reports.");
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReports();
  }, [page, limit]);

  useEffect(() => {
    getSeverityLevels().then((result) => {
      if (result.success) setSeverityLevels(result.data);
    });
  }, []);

  const handlePageChange = (newPage) => setPage(newPage);
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleCreate = async (formData, onSuccess) => {
    const result = await createFaultReport(formData);

    if (result.success) {
      toast.success("Fault report created!");
      onSuccess?.();
      fetchReports({ silent: true });
    } else {
      toast.error(result.message ?? "Failed to create fault report.");
    }
  };

  return {
    reports,
    pagination,
    limit,
    severityLevels,
    loading,
    refreshing,
    fetchReports,
    handleCreate,
    handlePageChange,
    handleLimitChange,
  };
}
