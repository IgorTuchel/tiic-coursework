import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { SecurityLogTable } from "../components/logs/SecurityLogTable";
import { LogDetailsModal } from "../components/logs/LogDetailsModal";
import { SearchByIdModal } from "../components/userManagement";
import { ErrorLogControls } from "../components/logs/ErrorLogControls";
import { ErrorLogEmptyState } from "../components/logs/ErrorLogEmptyState";
import { ErrorLogPagination } from "../components/logs/ErrorLogPagination";
import { useErrorLogs } from "../hooks/useErrorLogs";
import {
  useErrorLogFilters,
  useFilteredLogs,
} from "../hooks/useErrorLogFilters";

export function ErrorLogsPage() {
  const [selectedLog, setSelectedLog] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [userModalState, setUserModalState] = useState({
    query: "",
    result: null,
  });

  const filters = useErrorLogFilters();
  const { logs, pagination, loading, refreshing, fetchLogs } = useErrorLogs(
    filters.filterParams,
  );
  const processedLogs = useFilteredLogs(logs, filters.search);

  const openUserModal = (uuid) => {
    setUserModalState({ query: uuid, result: null });
    setShowUser(uuid);
  };

  const closeUserModal = () => {
    setShowUser(false);
    setUserModalState({ query: "", result: null });
  };

  return (
    <MainLayout title="Error Logs">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-100">Error Logs</h1>
          <p className="text-sm text-slate-400">
            Inspect server errors, HTTP failures, and stack traces.
          </p>
        </div>

        <ErrorLogControls
          filters={filters}
          refreshing={refreshing}
          showAdvanced={showAdvanced}
          onToggleAdvanced={() => setShowAdvanced((v) => !v)}
          onRefresh={() => fetchLogs({ silent: true })}
          onOpenUserModal={openUserModal}
          logs={logs}
          processedLogs={processedLogs}
          pagination={pagination}
        />

        {!loading && processedLogs.length === 0 ? (
          <ErrorLogEmptyState
            activeFilterCount={filters.activeFilterCount}
            onClear={filters.clearFilters}
          />
        ) : (
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/20">
            <SecurityLogTable
              logs={processedLogs}
              loading={loading}
              onDetailsClick={(log) => setSelectedLog(log)}
              onUserClick={openUserModal}
            />
            <ErrorLogPagination
              pagination={pagination}
              onPageChange={filters.setPage}
              limit={filters.pageSize}
              onLimitChange={filters.handleLimitChange}
            />
          </div>
        )}
      </div>

      {showUser && (
        <SearchByIdModal
          UUID={showUser}
          onClose={closeUserModal}
          openModal={() => {}}
          savedState={userModalState}
          onSaveState={setUserModalState}
          roles={[]}
        />
      )}

      {selectedLog && (
        <LogDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </MainLayout>
  );
}

export default ErrorLogsPage;
