import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import MainLayout from "../layouts/MainLayout";
import { ReportDetails } from "../components/reports/ReportDetails";
import { AuthContext } from "../context/AuthContext";
import { useMaintenanceDetail } from "../hooks/useMaintenanceDetail";
import { useMaintenanceActions } from "../hooks/useMaintenanceActions";

export function MaintenanceDetailPage() {
  const { user } = useContext(AuthContext);
  const canManage =
    user?.roleInfo?.canManageReports ||
    user?.roleInfo?.canWorkOnReports ||
    false;
  const canAssign = user?.roleInfo?.canAssignReports ?? false;

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    report,
    setReport,
    availableUsers,
    availableTools,
    reportStatuses,
    severityLevels,
    loading,
    isArSupported,
  } = useMaintenanceDetail(id, canAssign);

  const actions = useMaintenanceActions(id, setReport);

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/app/maintenance")}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Go back">
            <LuArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold">Maintenance Report</h1>
        </div>

        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4" />
              <p className="text-slate-400">Loading report details...</p>
            </div>
          </div>
        ) : report ? (
          <ReportDetails
            report={report}
            availableUsers={availableUsers}
            availableTools={availableTools}
            reportStatuses={reportStatuses}
            severityLevels={severityLevels}
            onUpdateReportAR={actions.handleUpdateReportAR}
            onUpdateReport={actions.handleUpdateReport}
            onCreateNote={actions.handleCreateNote}
            onUpdateNote={actions.handleUpdateNote}
            onAddUser={actions.handleAddUser}
            onRemoveUser={actions.handleRemoveUser}
            onAddTool={actions.handleAddTool}
            onRemoveTool={actions.handleRemoveTool}
            canManage={canManage}
            canAssign={canAssign}
            isArSupported={isArSupported}
          />
        ) : (
          <p className="text-red-400">Report not found.</p>
        )}
      </div>
    </MainLayout>
  );
}
