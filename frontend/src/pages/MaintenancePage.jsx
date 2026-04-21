import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuSearch,
  LuRefreshCw,
  LuPlus,
  LuSlidersHorizontal,
  LuFileSearch,
  LuX,
} from "react-icons/lu";
import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";
import { ReportTable } from "../components/maintenance/ReportTable";
import { CreateReportModal } from "../components/maintenance/CreateReportModal";
import {
  getAllMaintenanceReports,
  createMaintenanceReport,
  getSeverityLevels,
  getAllTools,
} from "../services/maintenanceReports";

const SEVERITY_ORDER = { low: 1, medium: 2, high: 3, critical: 4 };

const QUICK_FILTERS = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
];

function sortReports(reports, sortKey) {
  const sorted = [...reports];

  switch (sortKey) {
    case "date_desc":
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

    case "date_asc":
      return sorted.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );

    case "severity_desc":
      return sorted.sort((a, b) => {
        const aVal =
          SEVERITY_ORDER[a.severityLevel?.severityLevelName?.toLowerCase()] ??
          0;
        const bVal =
          SEVERITY_ORDER[b.severityLevel?.severityLevelName?.toLowerCase()] ??
          0;
        return bVal - aVal;
      });

    case "severity_asc":
      return sorted.sort((a, b) => {
        const aVal =
          SEVERITY_ORDER[a.severityLevel?.severityLevelName?.toLowerCase()] ??
          0;
        const bVal =
          SEVERITY_ORDER[b.severityLevel?.severityLevelName?.toLowerCase()] ??
          0;
        return aVal - bVal;
      });

    case "status":
      return sorted.sort((a, b) =>
        (a.reportStatus?.statusName ?? "").localeCompare(
          b.reportStatus?.statusName ?? "",
        ),
      );

    case "creator":
      return sorted.sort((a, b) => {
        const aName = a.createdByUser
          ? `${a.createdByUser.firstName} ${a.createdByUser.lastName}`
          : "";
        const bName = b.createdByUser
          ? `${b.createdByUser.firstName} ${b.createdByUser.lastName}`
          : "";
        return aName.localeCompare(bName);
      });

    case "name":
      return sorted.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

    default:
      return sorted;
  }
}

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function getSearchBlob(report) {
  const creator = report.createdByUser
    ? `${report.createdByUser.firstName} ${report.createdByUser.lastName}`
    : "";

  const severity = report.severityLevel?.severityLevelName ?? "";
  const status = report.reportStatus?.statusName ?? "";
  const tools = (report.toolChecks ?? []).map((tool) => tool.name).join(" ");

  return normalize(
    [
      report.name,
      report.description,
      creator,
      severity,
      status,
      tools,
      report.maintenanceReportID,
    ].join(" "),
  );
}

function matchesQuickFilter(report, filterKey) {
  if (!filterKey || filterKey === "all") return true;

  const severity = normalize(report.severityLevel?.severityLevelName);
  const status = normalize(report.reportStatus?.statusName);

  return severity === filterKey || status === filterKey;
}

export function MaintenancePage() {
  const [reports, setReports] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [availableTools, setAvailableTools] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("date_desc");
  const [quickFilter, setQuickFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const navigate = useNavigate();

  const fetchReports = async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

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

  const handleCreate = async (formData) => {
    const result = await createMaintenanceReport(formData);

    if (result.success) {
      toast.success("Report created!");
      setShowCreate(false);
      fetchReports({ silent: true });
    } else {
      toast.error(result.message ?? "Failed to create report.");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setQuickFilter("all");
    setSortKey("date_desc");
  };

  return (
    <MainLayout title="Maintenance Reports">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-100">
              Maintenance Reports
            </h1>
            <p className="text-sm text-slate-400">
              Track open issues, review severity, and manage report workflows.
            </p>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors shrink-0">
            <LuPlus size={15} />
            New Report
          </button>
        </div>

        {/* Controls */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1 min-w-[240px]">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description, creator, status, severity, or tool..."
                className="w-full rounded-md bg-slate-950 border border-slate-800 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <LuSlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="rounded-md bg-slate-950 border border-slate-800 pl-9 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="date_desc">Newest first</option>
                  <option value="date_asc">Oldest first</option>
                  <option value="severity_desc">Severity: high to low</option>
                  <option value="severity_asc">Severity: low to high</option>
                  <option value="status">Status</option>
                  <option value="creator">Creator</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <button
                onClick={() => fetchReports({ silent: true })}
                title="Refresh"
                className="rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2.5 text-slate-300 transition-colors">
                <LuRefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2.5 text-sm text-slate-300 transition-colors">
                  <LuX size={14} />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {QUICK_FILTERS.map((filter) => {
              const isActive = quickFilter === filter.key;

              return (
                <button
                  key={filter.key}
                  onClick={() => setQuickFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  }`}>
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Showing {processedReports.length} of {reports.length} reports
            </span>
            {(search || quickFilter !== "all") && (
              <span className="text-slate-400">Filtered results</span>
            )}
          </div>
        </div>

        {/* Content */}
        {!loading && processedReports.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <LuFileSearch size={20} />
              </div>

              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-200">
                  No reports found
                </h2>
                <p className="text-sm text-slate-500 max-w-md">
                  Try adjusting your search or filters, or create a new
                  maintenance report.
                </p>
              </div>

              {(search || quickFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="mt-1 text-sm text-sky-400 hover:text-sky-300 transition-colors">
                  Reset search and filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/20">
            <ReportTable
              loading={loading}
              reports={processedReports}
              onActionClick={(report) =>
                navigate(
                  `/app/maintenance/${report.maintenanceReportID || report.reportID}`,
                )
              }
            />
          </div>
        )}
      </div>

      {showCreate && (
        <CreateReportModal
          severityLevels={severityLevels}
          availableTools={availableTools}
          onSubmit={handleCreate}
          onClose={() => setShowCreate(false)}
        />
      )}
    </MainLayout>
  );
}
