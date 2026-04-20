import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuArrowLeft } from "react-icons/lu";
import MainLayout from "../layouts/MainLayout";
import { ReportDetails } from "../components/maintenance/ReportDetails";
import { getAllUsers } from "../services/getUsersService";
import {
  getMaintenanceReportById,
  getAllTools,
  getReportStatuses,
  getSeverityLevels,
  updateMaintenanceReport,
  updateMaintenanceReportNote,
  createMaintenanceReportNote,
  assignUserToReport,
  unassignUserFromReport,
  addToolToReport,
  removeToolFromReport,
} from "../services/maintenanceReports";

export function MaintenanceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableTools, setAvailableTools] = useState([]);
  const [reportStatuses, setReportStatuses] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [
        reportResult,
        usersResult,
        toolsResult,
        statusesResult,
        severitiesResult,
      ] = await Promise.all([
        getMaintenanceReportById(id),
        getAllUsers(),
        getAllTools(),
        getReportStatuses(),
        getSeverityLevels(),
      ]);

      if (reportResult.success) setReport(reportResult.data);
      else toast.error(reportResult.message || "Failed to load report.");

      if (usersResult.success) setAvailableUsers(usersResult.data);
      else toast.error(usersResult.message || "Failed to load users.");

      if (toolsResult.success) setAvailableTools(toolsResult.data);
      else toast.error(toolsResult.message || "Failed to load tools.");

      if (statusesResult.success) setReportStatuses(statusesResult.data);
      else toast.error(statusesResult.message || "Failed to load statuses.");

      if (severitiesResult.success) setSeverityLevels(severitiesResult.data);
      else
        toast.error(severitiesResult.message || "Failed to load severities.");

      setLoading(false);
    };

    fetchAll();
  }, [id]);

  const handleUpdateReportAR = async (fields) => {
    const result = await updateMaintenanceReport(id, {
      markerScanBlob: fields.markerScanBlob,
    });
    if (result.success) {
      setReport((prev) => ({ ...prev, ...result.data }));
      toast.success("Marker scan saved.");
    } else {
      toast.error(result.message || "Failed to save marker scan.");
    }
  };

  const handleUpdateReport = async (fields) => {
    const result = await updateMaintenanceReport(id, {
      name: fields.name,
      description: fields.description,
      status: fields.reportStatusID,
      severity: fields.severityLevelID,
    });
    if (result.success) {
      setReport((prev) => ({ ...prev, ...result.data }));
      toast.success("Report updated.");
    } else {
      toast.error(result.message || "Failed to update report.");
    }
  };

  const handleCreateNote = async ({ title, content }) => {
    const result = await createMaintenanceReportNote(id, { title, content });
    if (result.success) {
      setReport((prev) => ({ ...prev, notes: [...prev.notes, result.data] }));
      toast.success("Note created.");
    } else {
      toast.error(result.message || "Failed to create note.");
    }
  };

  const handleUpdateNote = async (updated) => {
    const result = await updateMaintenanceReportNote(
      id,
      updated.reportNoteID,
      updated,
    );
    if (result.success) {
      setReport((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n.reportNoteID === updated.reportNoteID ? updated : n,
        ),
      }));
      toast.success("Note updated.");
    } else {
      toast.error(result.message || "Failed to update note.");
    }
  };

  const handleAddUser = async (user) => {
    const result = await assignUserToReport(id, user.userID);
    if (result.success) {
      setReport((prev) => ({
        ...prev,
        assignedUsers: [...prev.assignedUsers, user],
      }));
      toast.success(`${user.firstName} assigned.`);
    } else {
      toast.error(result.message || "Failed to assign user.");
    }
  };

  const handleRemoveUser = async (user) => {
    const result = await unassignUserFromReport(id, user.userID);
    if (result.success) {
      setReport((prev) => ({
        ...prev,
        assignedUsers: prev.assignedUsers.filter(
          (u) => u.userID !== user.userID,
        ),
      }));
      toast.success(`${user.firstName} removed.`);
    } else {
      toast.error(result.message || "Failed to remove user.");
    }
  };

  const handleAddTool = async (tool) => {
    const result = await addToolToReport(id, tool.toolID);
    if (result.success) {
      setReport((prev) => ({
        ...prev,
        toolChecks: [...prev.toolChecks, tool],
      }));
      toast.success(`${tool.name} added.`);
    } else {
      toast.error(result.message || "Failed to add tool.");
    }
  };

  const handleRemoveTool = async (tool) => {
    const result = await removeToolFromReport(id, tool.toolID);
    if (result.success) {
      setReport((prev) => ({
        ...prev,
        toolChecks: prev.toolChecks.filter((t) => t.toolID !== tool.toolID),
      }));
      toast.success(`${tool.name} removed.`);
    } else {
      toast.error(result.message || "Failed to remove tool.");
    }
  };

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
            onUpdateReportAR={handleUpdateReportAR}
            onUpdateReport={handleUpdateReport}
            onCreateNote={handleCreateNote}
            onUpdateNote={handleUpdateNote}
            onAddUser={handleAddUser}
            onRemoveUser={handleRemoveUser}
            onAddTool={handleAddTool}
            onRemoveTool={handleRemoveTool}
          />
        ) : (
          <p className="text-red-400">Report not found.</p>
        )}
      </div>
    </MainLayout>
  );
}
