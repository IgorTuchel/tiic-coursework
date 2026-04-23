import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { LuArrowLeft } from "react-icons/lu";
import MainLayout from "../layouts/MainLayout";
import { ReportDetails } from "../components/reports/ReportDetails";
import {
  getReportStatuses,
  getSeverityLevels,
} from "../services/maintenanceReports";
import { AuthContext } from "../context/AuthContext";
import {
  assignUserToReport,
  createFaultReportNote,
  getAssignableUsers,
  getFaultReportById,
  unassignUserFromReport,
  updateFaultReport,
  updateFaultReportNote,
} from "../services/faultReports";

export function FaultDetailPage() {
  const { user } = useContext(AuthContext);
  const canManage =
    user?.roleInfo?.canManageFaults ||
    user?.roleInfo?.canSuggestFaults ||
    false;
  const canAssign = user?.roleInfo?.canAssignFaults ?? false;
  const navigate = useNavigate();
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [reportStatuses, setReportStatuses] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [reportResult, statusesResult, severitiesResult] =
        await Promise.all([
          getFaultReportById(id),
          getReportStatuses(),
          getSeverityLevels(),
        ]);

      if (reportResult.success) setReport(reportResult.data);
      else toast.error(reportResult.message || "Failed to load report.");

      if (statusesResult.success) setReportStatuses(statusesResult.data);
      else toast.error(statusesResult.message || "Failed to load statuses.");

      if (severitiesResult.success) setSeverityLevels(severitiesResult.data);
      else
        toast.error(severitiesResult.message || "Failed to load severities.");

      setLoading(false);
    };

    if (canAssign) {
      getAssignableUsers().then((res) => {
        if (res.success) setAvailableUsers(res.data);
        else toast.error(res.message || "Failed to load users.");
      });
    }
    fetchAll();
  }, [id, canAssign]);

  const handleUpdateReport = async (fields) => {
    const result = await updateFaultReport(id, {
      name: fields.name,
      description: fields.description,
      status: fields.reportStatusID,
      severity: fields.severityLevelID,
    });
    if (result.success) {
      console.log("Updated report:", result.data);
      setReport((prev) => ({ ...prev, ...result.data }));
      toast.success("Report updated.");
    } else {
      toast.error(result.message || "Failed to update report.");
    }
  };

  const handleCreateNote = async ({ title, content }) => {
    const result = await createFaultReportNote(id, { title, content });
    if (result.success) {
      setReport((prev) => ({ ...prev, notes: [...prev.notes, result.data] }));
      toast.success("Note created.");
    } else {
      toast.error(result.message || "Failed to create note.");
    }
  };

  const handleUpdateNote = async (updated) => {
    const result = await updateFaultReportNote(
      id,
      updated.reportNoteID,
      updated,
    );
    if (result.success) {
      setReport((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n.reportNoteID === updated.reportNoteID ? result.data : n,
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

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/app/faults")}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Go back">
            <LuArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold">Fault Report</h1>
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
            maintenanceOrFault="Fault"
            availableUsers={availableUsers}
            reportStatuses={reportStatuses}
            severityLevels={severityLevels}
            onUpdateReport={handleUpdateReport}
            onCreateNote={handleCreateNote}
            onUpdateNote={handleUpdateNote}
            onAddUser={handleAddUser}
            onRemoveUser={handleRemoveUser}
            canManage={canManage}
            canAssign={canAssign}
          />
        ) : (
          <p className="text-red-400">Report not found.</p>
        )}
      </div>
    </MainLayout>
  );
}
