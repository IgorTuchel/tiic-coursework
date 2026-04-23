import { useState } from "react";
import { LuCalendar, LuIdCard, LuUser } from "react-icons/lu";
import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";
import { NoteModal } from "./NoteModal";
import {
  Badge,
  MetaItem,
  AssignedUsersSection,
  ToolChecksSection,
} from "./ReportDetailsHelpers";
import { SEVERITY_STYLES, STATUS_STYLES, inputCls } from "../../utils/styles";
import { downloadMarkerPdf } from "../../services/maintenanceReports";
import { useMarkerUrl } from "../../hooks/useMarkerUrl";
import { useModelFiles } from "../../hooks/useModelFiles";
import { ReportHeader } from "./ReportHeader";
import { NotesSection } from "./NotesSection";
import { ARWorkspaceSection } from "./ARWorkspaceSection";
import { AIView, ARView } from "./FullScreenWorkflow";

function parsePolygonBlob(blob) {
  try {
    const parsed = JSON.parse(blob);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function buildEditForm(report) {
  return {
    name: report.name || "",
    description: report.description || "",
    severityLevelID: report.severityLevel?.severityLevelID || "",
    reportStatusID: report.reportStatus?.reportStatusID || "",
  };
}

export function ReportDetails({
  maintenanceOrFault = "Maintenance",
  report,
  availableUsers = [],
  availableTools = [],
  reportStatuses = [],
  severityLevels = [],
  canManage,
  canAssign,
  onUpdateReport,
  onUpdateNote,
  onUpdateReportAR,
  onCreateNote,
  onAddUser,
  onRemoveUser,
  onAddTool,
  onRemoveTool,
}) {
  // Maintenance Report editing
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState(() => buildEditForm(report));

  // MR notes management
  const [selectedNote, setSelectedNote] = useState(null);
  const [creatingNote, setCreatingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: "", content: "" });
  const [savingNote, setSavingNote] = useState(false);

  // AR + tool checks workflows
  const [workflowView, setWorkflowView] = useState(null); // null / "ai" / "ar"
  const [toolCheckPassed, setToolCheckPassed] = useState(false);
  const [isArSupported, setIsArSupported] = useState(false);
  const markerUrl =
    maintenanceOrFault === "Maintenance"
      ? useMarkerUrl(report.maintenanceReportID)
      : null;
  const modelFiles = useModelFiles();
  const hasTools = report.toolChecks?.length > 0;
  const initialPolygonData = parsePolygonBlob(report.markerScanBlob);

  const isClean =
    editForm.name !== (report.name || "") ||
    editForm.description !== (report.description || "") ||
    editForm.severityLevelID !==
      (report.severityLevel?.severityLevelID || "") ||
    editForm.reportStatusID !== (report.reportStatus?.reportStatusID || "");

  const activeSeverity = editing
    ? severityLevels.find((s) => s.severityLevelID === editForm.severityLevelID)
        ?.severityLevelName
    : report.severityLevel?.severityLevelName;

  const activeStatus = editing
    ? reportStatuses.find((s) => s.reportStatusID === editForm.reportStatusID)
        ?.statusName
    : report.reportStatus?.statusName;

  // edit handlers
  const field = (key) => ({
    value: editForm[key],
    onChange: (e) => setEditForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const handleSave = async () => {
    setSaving(true);
    await onUpdateReport(editForm);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditForm(buildEditForm(report));
    setEditing(false);
  };

  // MR note handlers
  const handleNoteFieldChange = (key, value) =>
    setNoteForm((f) => ({ ...f, [key]: value }));

  const handleSubmitNote = async () => {
    if (!noteForm.title || !noteForm.content) return;
    setSavingNote(true);
    await onCreateNote(noteForm);
    setNoteForm({ title: "", content: "" });
    setCreatingNote(false);
    setSavingNote(false);
  };

  const handleCancelNote = () => {
    setCreatingNote(false);
    setNoteForm({ title: "", content: "" });
  };

  // AR handlers
  const handleARSave = async (coords) => {
    const result = await onUpdateReportAR({
      markerScanBlob: JSON.stringify(coords),
    });
    if (result?.success !== false) toast.success("Polygon saved!");
  };

  const handleDownloadPdf = async () => {
    const result = await downloadMarkerPdf(report.maintenanceReportID);
    if (!result.success) toast.error(result.message);
  };

  const handleOpenWorkflow = () =>
    setWorkflowView(toolCheckPassed || !hasTools ? "ar" : "ai");

  const handleAIComplete = () => {
    setToolCheckPassed(true);
    setWorkflowView("ar");
  };

  // Views
  if (workflowView === "ai" && maintenanceOrFault === "Maintenance") {
    return (
      <AIView
        modelFiles={modelFiles}
        report={report}
        onComplete={handleAIComplete}
        onExit={() => setWorkflowView(null)}
      />
    );
  }

  if (workflowView === "ar" && maintenanceOrFault === "Maintenance") {
    return (
      <ARView
        markerUrl={markerUrl}
        report={report}
        setIsArSupported={setIsArSupported}
        initialPolygonData={initialPolygonData}
        onSave={handleARSave}
        onExit={() => setWorkflowView(null)}
      />
    );
  }

  return (
    <div className="space-y-6 p-1">
      <ReportHeader
        report={report}
        editing={editing}
        saving={saving}
        isClean={isClean}
        field={field}
        canManage={canManage}
        onEdit={() => setEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {/* Severity + status badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge value={activeSeverity} styleMap={SEVERITY_STYLES} />
        <Badge value={activeStatus} styleMap={STATUS_STYLES} />
        {editing && (
          <div className="flex gap-2 flex-wrap mt-1 w-full">
            <select {...field("severityLevelID")} className={inputCls}>
              {severityLevels.map((s) => (
                <option key={s.severityLevelID} value={s.severityLevelID}>
                  {s.severityLevelName}
                </option>
              ))}
            </select>
            <select {...field("reportStatusID")} className={inputCls}>
              {reportStatuses.map((s) => (
                <option key={s.reportStatusID} value={s.reportStatusID}>
                  {s.statusName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MetaItem icon={LuIdCard} label="Report ID">
          {report.maintenanceReportID || report.faultReportID || "N/A"}
        </MetaItem>
        <MetaItem icon={LuUser} label="Created by">
          {report.createdByUser
            ? `${report.createdByUser.firstName} ${report.createdByUser.lastName}`
            : "Unknown"}
        </MetaItem>
        <MetaItem icon={LuCalendar} label="Created">
          {new Date(report.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </MetaItem>
        <MetaItem icon={LuCalendar} label="Last updated">
          {new Date(report.updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </MetaItem>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Description
        </p>
        {editing ? (
          <textarea
            {...field("description")}
            rows={5}
            className={inputCls}
            placeholder="Report description"
          />
        ) : (
          <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
            {report.description || "No description provided."}
          </p>
        )}
      </div>

      <AssignedUsersSection
        assignedUsers={report.assignedUsers ?? []}
        availableUsers={availableUsers}
        onAdd={canAssign ? onAddUser : null}
        onRemove={canAssign ? onRemoveUser : null}
      />

      {maintenanceOrFault === "Maintenance" && (
        <ToolChecksSection
          toolChecks={report.toolChecks ?? []}
          availableTools={availableTools}
          onAdd={canManage ? onAddTool : null}
          onRemove={canManage ? onRemoveTool : null}
        />
      )}

      <NotesSection
        notes={report.notes}
        canManage={canManage}
        creatingNote={creatingNote}
        noteForm={noteForm}
        savingNote={savingNote}
        onToggleCreate={() => setCreatingNote((v) => !v)}
        onChangeField={handleNoteFieldChange}
        onSubmit={handleSubmitNote}
        onCancelCreate={handleCancelNote}
        onSelectNote={setSelectedNote}
      />

      {maintenanceOrFault === "Maintenance" && (
        <ARWorkspaceSection
          hasTools={hasTools}
          toolCheckPassed={toolCheckPassed}
          markerUrl={markerUrl}
          modelFiles={modelFiles}
          polygonData={initialPolygonData}
          onOpenWorkflow={handleOpenWorkflow}
          onDownloadPdf={handleDownloadPdf}
          isArSupported={isArSupported}
        />
      )}

      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onSave={canManage ? onUpdateNote : null}
        />
      )}
    </div>
  );
}
