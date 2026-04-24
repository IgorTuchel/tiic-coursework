import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { getErrorLogs } from "../services/errorLogs";

export function useErrorLogs(filterParams) {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {
    page,
    pageSize,
    httpFilter,
    errorNameFilter,
    methodFilter,
    userIDFilter,
    ipFilter,
    dateFrom,
    dateTo,
  } = filterParams;

  const fetchLogs = useCallback(
    async ({ silent = false, targetPage = page } = {}) => {
      if (silent) setRefreshing(true);
      else setLoading(true);

      const params = { page: targetPage, limit: pageSize };

      if (httpFilter !== "all") {
        const isRange = ["3xx", "4xx", "5xx"].includes(httpFilter);
        if (isRange) params.httpStatusRange = httpFilter;
        else params.httpStatusCode = httpFilter;
      }

      if (errorNameFilter) params.errorName = errorNameFilter;
      if (methodFilter) params.method = methodFilter;
      if (userIDFilter.trim()) params.userID = userIDFilter.trim();
      if (ipFilter.trim()) params.ipAddress = ipFilter.trim();
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;

      const res = await getErrorLogs(params);

      if (res.success) {
        setLogs(res.data.logs);
        setPagination(res.data.pagination);
      } else {
        toast.error(res.message);
      }

      setLoading(false);
      setRefreshing(false);
    },
    [
      page,
      pageSize,
      httpFilter,
      errorNameFilter,
      methodFilter,
      userIDFilter,
      ipFilter,
      dateFrom,
      dateTo,
    ],
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, pagination, loading, refreshing, fetchLogs };
}
