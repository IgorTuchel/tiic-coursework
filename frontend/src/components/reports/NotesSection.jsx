import { LuPlus, LuSave } from "react-icons/lu";
import { inputCls } from "../../utils/styles";

function NoteForm({ noteForm, saving, onChangeField, onSubmit, onCancel }) {
  return (
    <div className="space-y-2 rounded-lg bg-slate-800 border border-slate-700 p-3">
      <input
        value={noteForm.title}
        onChange={(e) => onChangeField("title", e.target.value)}
        className={inputCls}
        placeholder="Note title"
      />
      <textarea
        value={noteForm.content}
        onChange={(e) => onChangeField("content", e.target.value)}
        rows={3}
        className={inputCls}
        placeholder="Note content"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors">
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={saving || !noteForm.title || !noteForm.content}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
          <LuSave size={13} /> {saving ? "Saving…" : "Save note"}
        </button>
      </div>
    </div>
  );
}

function NoteList({ notes, onSelect }) {
  if (!notes?.length) {
    return <p className="text-sm text-slate-500 italic">No notes yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <li
          key={note.reportNoteID}
          onClick={() => onSelect(note)}
          className="rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 p-3 cursor-pointer transition-colors group">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
              {note.title}
            </p>
            <span className="text-[11px] text-slate-500 shrink-0">
              {new Date(note.createdAt).toLocaleDateString("en-GB")}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {note.content}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function NotesSection({
  notes,
  canManage,
  creatingNote,
  noteForm,
  savingNote,
  onToggleCreate,
  onChangeField,
  onSubmit,
  onCancelCreate,
  onSelectNote,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Notes{" "}
          {notes?.length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-700 text-slate-300 text-[10px]">
              {notes.length}
            </span>
          )}
        </p>
        {canManage && (
          <button
            onClick={onToggleCreate}
            className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors">
            <LuPlus size={13} /> Add note
          </button>
        )}
      </div>

      {creatingNote && (
        <NoteForm
          noteForm={noteForm}
          saving={savingNote}
          onChangeField={onChangeField}
          onSubmit={onSubmit}
          onCancel={onCancelCreate}
        />
      )}

      {!creatingNote && <NoteList notes={notes} onSelect={onSelectNote} />}
    </div>
  );
}
