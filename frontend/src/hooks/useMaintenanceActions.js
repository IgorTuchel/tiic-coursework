import toast from "react-hot-toast";
import {
  updateMaintenanceReport,
  updateMaintenanceReportNote,
  createMaintenanceReportNote,
  assignUserToReport,
  unassignUserFromReport,
  addToolToReport,
  removeToolFromReport,
} from "../services/maintenanceReports";

export function useMaintenanceActions(id, setReport) {
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

  return {
    handleUpdateReportAR,
    handleUpdateReport,
    handleCreateNote,
    handleUpdateNote,
    handleAddUser,
    handleRemoveUser,
    handleAddTool,
    handleRemoveTool,
  };
}
