import { useState } from "react";
import { LuX, LuPlus, LuSave } from "react-icons/lu";
import { inputCls } from "../../utils/styles";

export function CreateReportModal({
  maintenanceOrFault = "Maintenance",
  severityLevels = [],
  availableTools = [],
  onSubmit,
  onClose,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    severityLevelID: severityLevels[0]?.severityLevelID ?? "",
  });
  const [selectedTools, setSelectedTools] = useState([]);
  const [saving, setSaving] = useState(false);

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const unselectedTools = availableTools.filter(
    (t) => !selectedTools.some((s) => s.toolID === t.toolID),
  );

  const addTool = (toolID) => {
    const tool = availableTools.find((t) => t.toolID === toolID);
    if (tool) setSelectedTools((prev) => [...prev, tool]);
  };

  const removeTool = (toolID) =>
    setSelectedTools((prev) => prev.filter((t) => t.toolID !== toolID));

  const canSubmit =
    form.name.trim() && form.severityLevelID && form.description.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    if (maintenanceOrFault === "Maintenance") {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        severityLevelID: form.severityLevelID,
        tools: selectedTools.map((t) => t.toolID),
      });
    } else {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        severityLevelID: form.severityLevelID,
      });
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="text-base font-semibold text-slate-100">
            New {maintenanceOrFault} Report
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
            <LuX size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              {...field("name")}
              className={inputCls}
              placeholder="e.g. HVAC Unit 3 Inspection"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              {...field("description")}
              rows={3}
              className={inputCls}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Severity <span className="text-red-400">*</span>
            </label>
            <select {...field("severityLevelID")} className={inputCls}>
              {severityLevels.map((s) => (
                <option key={s.severityLevelID} value={s.severityLevelID}>
                  {s.severityLevelName}
                </option>
              ))}
            </select>
          </div>
          {maintenanceOrFault === "Maintenance" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Required Tools
              </label>

              {selectedTools.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTools.map((tool) => (
                    <span
                      key={tool.toolID}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 pl-3 pr-1.5 py-1 text-xs text-slate-300">
                      {tool.name}
                      <button
                        onClick={() => removeTool(tool.toolID)}
                        className="rounded-full p-0.5 text-slate-500 hover:text-red-400 transition-colors">
                        <LuX size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {unselectedTools.length > 0 && (
                <select
                  className={inputCls}
                  value=""
                  onChange={(e) => {
                    if (e.target.value) addTool(e.target.value);
                  }}>
                  <option value="" disabled>
                    Add a tool...
                  </option>
                  {unselectedTools.map((t) => (
                    <option key={t.toolID} value={t.toolID}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}

              {availableTools.length === 0 && (
                <p className="text-xs text-slate-500 italic">
                  No tools available.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
            <LuSave size={14} />
            {saving ? "Creating…" : `Create ${maintenanceOrFault} Report`}
          </button>
        </div>
      </div>
    </div>
  );
}
