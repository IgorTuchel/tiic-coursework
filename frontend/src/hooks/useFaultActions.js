import toast from "react-hot-toast";
import {
  updateFaultReport,
  updateFaultReportNote,
  createFaultReportNote,
  assignUserToReport,
  unassignUserFromReport,
} from "../services/faultReports";

export function useFaultActions(id, setReport) {
  const handleUpdateReport = async (fields) => {
    const result = await updateFaultReport(id, {
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

  return {
    handleUpdateReport,
    handleCreateNote,
    handleUpdateNote,
    handleAddUser,
    handleRemoveUser,
  };
}
