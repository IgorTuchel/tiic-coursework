import { LuScanLine, LuCpu, LuFileDown } from "react-icons/lu";

export function ARWorkspaceSection({
  hasTools,
  toolCheckPassed,
  markerUrl,
  modelFiles,
  polygonData,
  onOpenWorkflow,
  isArSupported,
  onDownloadPdf,
}) {
  const workflowReady = !!markerUrl && !!modelFiles;
  const workflowLabel =
    toolCheckPassed || !hasTools ? "Open AR Session" : "Start Tool Check";

  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
        <LuScanLine size={13} /> AR and Tool Check
      </p>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={onDownloadPdf}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 font-medium transition-colors">
          <LuFileDown size={15} /> Download Marker
        </button>
        {!isArSupported && (
          <p className="text-sm text-red-400">
            AR is not supported on this device/browser.
          </p>
        )}
        {isArSupported && (
          <button
            disabled={!workflowReady}
            onClick={onOpenWorkflow}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm text-white font-semibold transition-colors">
            <LuCpu size={15} /> {workflowLabel}
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500">
        {polygonData
          ? `Saved area: ${polygonData.length} vertices`
          : "No area mapped yet."}
      </p>
    </div>
  );
}
