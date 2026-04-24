import { useState, useMemo } from "react";
import {
  normalize,
  getSearchBlob,
  matchesQuickFilter,
  sortReports,
} from "../utils/utils";

export function useMaintenanceFilters(reports) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("date_desc");
  const [quickFilter, setQuickFilter] = useState("all");

  const processedReports = useMemo(() => {
    const query = normalize(search);

    const filtered = reports.filter((report) => {
      const searchMatch = !query || getSearchBlob(report).includes(query);
      const quickMatch = matchesQuickFilter(report, quickFilter);
      return searchMatch && quickMatch;
    });

    return sortReports(filtered, sortKey);
  }, [reports, search, sortKey, quickFilter]);

  const activeFilterCount =
    (search.trim() ? 1 : 0) + (quickFilter !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setQuickFilter("all");
    setSortKey("date_desc");
  };

  return {
    search,
    setSearch,
    sortKey,
    setSortKey,
    quickFilter,
    setQuickFilter,
    processedReports,
    activeFilterCount,
    clearFilters,
  };
}
