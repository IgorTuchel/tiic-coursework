import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuSearch,
  LuRefreshCw,
  LuPlus,
  LuSlidersHorizontal,
  LuFileSearch,
  LuX,
} from "react-icons/lu";
import { QUICK_FILTERS } from "../utils/utils";
import MainLayout from "../layouts/MainLayout";
import { ReportTable } from "../components/reports/ReportTable";
import { CreateReportModal } from "../components/reports/CreateReportModal";
import { useFaultReports } from "../hooks/useFaultReports";
import { useMaintenanceFilters } from "../hooks/useMaintenanceFilters";

export function FaultPage() {
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const {
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
  } = useFaultReports();

  const {
    search,
    setSearch,
    sortKey,
    setSortKey,
    quickFilter,
    setQuickFilter,
    processedReports,
    activeFilterCount,
    clearFilters,
  } = useMaintenanceFilters(reports);

  return (
    <MainLayout title="Fault Reports">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-100">
              Fault Reports
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
                placeholder="Search by title, description, creator, status, or severity..."
                aria-label="Search across faults"
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
              Showing{" "}
              <span className="text-slate-300">{processedReports.length}</span>{" "}
              of{" "}
              <span className="text-slate-300">
                {pagination?.total ?? reports.length}
              </span>{" "}
              reports
              {(search || quickFilter !== "all") && (
                <span className="text-slate-400 ml-1">(filtered)</span>
              )}
            </span>
            {(search || quickFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="text-sky-400 hover:text-sky-300 transition-colors">
                Reset filters
              </button>
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
                  Try adjusting your search or filters, or create a new fault
                  report.
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
              pagination={pagination}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              onActionClick={(report) =>
                navigate(`/app/faults/${report.faultReportID}`)
              }
            />
          </div>
        )}
      </div>

      {showCreate && (
        <CreateReportModal
          severityLevels={severityLevels}
          onSubmit={(formData) =>
            handleCreate(formData, () => setShowCreate(false))
          }
          maintenanceOrFault="Fault"
          onClose={() => setShowCreate(false)}
        />
      )}
    </MainLayout>
  );
}
