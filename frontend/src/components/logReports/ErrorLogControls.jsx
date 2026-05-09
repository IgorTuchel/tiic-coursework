import { LuSearch, LuRefreshCw, LuX, LuFilter } from "react-icons/lu";

const HTTP_STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "3xx", label: "3xx" },
  { key: "4xx", label: "4xx" },
  { key: "5xx", label: "5xx" },
  { key: "400", label: "400" },
  { key: "401", label: "401" },
  { key: "403", label: "403" },
  { key: "404", label: "404" },
  { key: "500", label: "500" },
];

const ERROR_NAMES = [
  "BadRequestError",
  "UnauthorizedError",
  "ForbiddenError",
  "NotFoundError",
  "InternalServerError",
];

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"];

const STATUS_CODES = [
  "LOGIN_FAILURE",
  "LOGIN_FAILURE_MFA_REQUIRED",
  "LOGIN_FAILURE_ACCOUNT_LOCKED",
  "LOGIN_FAILURE_ACCOUNT_NOT_SETUP",
  "ACTION_REQUIRE_MFA",
  "UNAUTHORIZED",
  "BAD_REQUEST",
  "FORBIDDEN",
  "INTERNAL_SERVER_ERROR",
  "NOT_FOUND",
  "RUN_TIME_ERROR",
];

export function ErrorLogControls({
  filters,
  refreshing,
  showAdvanced,
  onToggleAdvanced,
  onRefresh,
  onOpenUserModal,
  logs,
  processedLogs,
  pagination,
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 min-w-[240px]">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            aria-label="Search bar log filter"
            placeholder="Search name, message, URL, IP, user ID…"
            className="w-full rounded-md bg-slate-950 border border-slate-800 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleAdvanced}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-2.5 text-sm transition-colors ${
              showAdvanced
                ? "border-sky-600 bg-sky-600/20 text-sky-300"
                : "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}>
            <LuFilter size={14} />
            Filters
            {filters.activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-sky-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                {filters.activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={onRefresh}
            title="Refresh"
            className="rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2.5 text-slate-300 transition-colors">
            <LuRefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          {filters.activeFilterCount > 0 && (
            <button
              onClick={filters.clearFilters}
              className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2.5 text-sm text-slate-300 transition-colors">
              <LuX size={14} />
              Clear{" "}
              {filters.activeFilterCount > 1
                ? `${filters.activeFilterCount} filters`
                : "filter"}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {HTTP_STATUS_FILTERS.map((f) => {
          const isActive = filters.httpFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => filters.applyFilter(filters.setHttpFilter)(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}>
              {f.label}
            </button>
          );
        })}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">Error type</label>
            <select
              value={filters.errorNameFilter}
              onChange={(e) =>
                filters.applyFilter(filters.setErrorName)(e.target.value)
              }
              className="rounded-md bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="">All types</option>
              {ERROR_NAMES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">Status Code</label>
            <select
              value={filters.statusCode}
              onChange={(e) =>
                filters.applyFilter(filters.setStatusCode)(e.target.value)
              }
              className="rounded-md bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="">All codes</option>
              {STATUS_CODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">HTTP method</label>
            <select
              value={filters.methodFilter}
              onChange={(e) =>
                filters.applyFilter(filters.setMethodFilter)(e.target.value)
              }
              className="rounded-md bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="">All methods</option>
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">IP address</label>
            <input
              value={filters.ipFilter}
              onChange={(e) =>
                filters.applyFilter(filters.setIpFilter)(e.target.value)
              }
              placeholder="192.168.1.1"
              className="rounded-md bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">User ID</label>
            <div className="flex gap-2">
              <input
                value={filters.userIDFilter}
                onChange={(e) =>
                  filters.applyFilter(filters.setUserIDFilter)(e.target.value)
                }
                placeholder="uuid…"
                className="flex-1 rounded-md bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
              {filters.userIDFilter.trim() && (
                <button
                  type="button"
                  onClick={() => onOpenUserModal(filters.userIDFilter.trim())}
                  title="Lookup user"
                  className="shrink-0 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 text-slate-300 transition-colors">
                  <LuSearch className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                filters.applyFilter(filters.setDateFrom)(e.target.value)
              }
              className="rounded-md bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                filters.applyFilter(filters.setDateTo)(e.target.value)
              }
              className="rounded-md bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          Showing {processedLogs.length}
          {filters.search.trim()
            ? ` of ${logs.length} on this page`
            : pagination
              ? ` of ${pagination.total} total`
              : ""}
        </span>
        {filters.activeFilterCount > 0 && (
          <span className="text-slate-400">Filtered results</span>
        )}
      </div>
    </div>
  );
}
