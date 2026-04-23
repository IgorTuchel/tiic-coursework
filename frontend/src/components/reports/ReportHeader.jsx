import { LuPencil, LuSave, LuX } from "react-icons/lu";
import { inputCls } from "../../utils/styles";

export function ReportHeader({
  report,
  editing,
  saving,
  isClean,
  field,
  canManage,
  onEdit,
  onSave,
  onCancel,
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            {...field("name")}
            className={inputCls}
            placeholder="Report name"
          />
        ) : (
          <h2 className="text-xl font-bold text-slate-100 truncate">
            {report.name || "Untitled Report"}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {canManage && !editing && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors">
            <LuPencil size={13} /> Edit
          </button>
        )}
        {editing && (
          <>
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors">
              <LuX size={13} /> Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!isClean || saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
              <LuSave size={13} /> {saving ? "Saving…" : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
