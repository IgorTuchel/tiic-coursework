import { useEffect, useState, useMemo } from "react";
import { ReportTable } from "../components/maintenance/ReportTable";
import MainLayout from "../layouts/MainLayout";
import { getAllMaintenanceReports } from "../services/maintenanceReports";
import { LuSearch, LuRefreshCw } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const SEVERITY_ORDER = { low: 1, medium: 2, high: 3, critical: 4 };

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
    default:
      return sorted;
  }
}

export function MaintenancePage() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReports = async () => {
    setLoading(true);
    const result = await getAllMaintenanceReports();
    if (result.success) {
      setReports(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const processedReports = useMemo(() => {
    const filtered = reports.filter((report) => {
      if (!search) return true;
      const titleMatch = report.name
        ? report.name.toLowerCase().includes(search.toLowerCase())
        : false;
      const creatorMatch = report.createdByUser
        ? `${report.createdByUser.firstName} ${report.createdByUser.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : false;
      return titleMatch || creatorMatch;
    });
    return sortReports(filtered, sortKey);
  }, [reports, search, sortKey]);

  return (
    <MainLayout title="Maintenance Reports">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Maintenance Reports</h1>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title or creator..."
              className="w-full rounded-md bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="rounded-md bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="">Sort by</option>
            <option value="date_desc">Date (newest)</option>
            <option value="date_asc">Date (oldest)</option>
            <option value="severity_desc">Severity (high to low)</option>
            <option value="severity_asc">Severity (low to high)</option>
            <option value="status">Status</option>
            <option value="creator">Creator</option>
          </select>
          <button
            onClick={fetchReports}
            title="Refresh"
            className="rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-slate-300 transition-colors">
            <LuRefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <ReportTable
            loading={loading}
            reports={processedReports}
            onActionClick={(report) => {
              navigate(
                `/app/maintenance/${report.maintenanceReportID || report.reportID}`,
              );
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
}
