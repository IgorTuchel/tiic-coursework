import { useState, useMemo } from "react";

const DEFAULT_PAGE_SIZE = 20;

function normalize(str) {
  return str.toLowerCase().trim();
}

export function useErrorLogFilters() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [httpFilter, setHttpFilter] = useState("all");
  const [errorNameFilter, setErrorName] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [userIDFilter, setUserIDFilter] = useState("");
  const [ipFilter, setIpFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const applyFilter = (setter) => (value) => {
    setPage(1);
    setter(value);
  };

  const handleLimitChange = (newLimit) => {
    setPage(1);
    setPageSize(newLimit);
  };

  const clearFilters = () => {
    setSearch("");
    setHttpFilter("all");
    setErrorName("");
    setMethodFilter("");
    setUserIDFilter("");
    setIpFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const activeFilterCount = [
    search.trim(),
    httpFilter !== "all",
    errorNameFilter,
    methodFilter,
    userIDFilter.trim(),
    ipFilter.trim(),
    dateFrom,
    dateTo,
  ].filter(Boolean).length;

  const filterParams = {
    page,
    pageSize,
    httpFilter,
    errorNameFilter,
    methodFilter,
    userIDFilter,
    ipFilter,
    dateFrom,
    dateTo,
  };

  return {
    // State
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    httpFilter,
    errorNameFilter,
    methodFilter,
    userIDFilter,
    setUserIDFilter,
    ipFilter,
    dateFrom,
    dateTo,
    activeFilterCount,
    filterParams,
    // Handlers
    applyFilter,
    handleLimitChange,
    clearFilters,
    setHttpFilter,
    setErrorName,
    setMethodFilter,
    setIpFilter,
    setDateFrom,
    setDateTo,
  };
}

export function useFilteredLogs(logs, search) {
  return useMemo(() => {
    if (!search.trim()) return logs;
    const q = normalize(search);
    return logs.filter((log) =>
      [
        log.errorName,
        log.statusCode,
        String(log.httpStatusCode),
        log.message,
        log.url,
        log.method,
        log.userID,
        log.ipAddress,
      ]
        .filter(Boolean)
        .some((v) => normalize(String(v)).includes(q)),
    );
  }, [logs, search]);
}
