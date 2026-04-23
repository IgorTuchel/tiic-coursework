import { useState } from "react";
import { Modal } from "../Modal";
import { LuPencil, LuSave } from "react-icons/lu";
import { inputCls } from "../../utils/styles";

function NoteViewModal({ note, onClose, onStartEdit }) {
  const createdAt = note.createdAt ? new Date(note.createdAt) : null;
  const updatedAt = note.updatedAt ? new Date(note.updatedAt) : null;
  const author = note.createdByUser?.firstName
    ? `${note.createdByUser.firstName}${note.createdByUser.lastName ? ` ${note.createdByUser.lastName}` : ""}`
    : "Unknown";

  return (
    <Modal
      title={note.title || "Untitled Note"}
      subtitle={`By ${author} · ${createdAt?.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) ?? "N/A"}`}
      onClose={onClose}
      maxWidth="max-w-lg"
      footer={
        <div className="flex gap-2">
          <button
            onClick={onStartEdit}
            className="flex items-center gap-1.5 rounded-md bg-sky-600 hover:bg-sky-500 px-3 py-2 text-sm text-white font-medium transition-colors">
            <LuPencil className="w-3.5 h-3.5" />
            Edit note
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
            Close
          </button>
        </div>
      }>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-300 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
          {note.content || "No content."}
        </p>
        {updatedAt && updatedAt.getTime() !== createdAt?.getTime() && (
          <p className="text-xs text-slate-500">
            Last edited{" "}
            {updatedAt.toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            at{" "}
            {updatedAt.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </Modal>
  );
}

function NoteEditModal({ note, onClose, onBack, onSave }) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...note, title, content });
    setSaving(false);
  };

  const isDirty =
    title !== (note.title || "") || content !== (note.content || "");

  return (
    <Modal
      title="Edit Note"
      subtitle={note.title || "Untitled Note"}
      onClose={onClose}
      onBack={onBack}
      maxWidth="max-w-lg"
      footer={
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="flex items-center gap-1.5 rounded-md bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2 text-sm text-white font-medium transition-colors">
            <LuSave className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            onClick={onBack}
            className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
            Cancel
          </button>
        </div>
      }>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="Note title"
          />
        </div>
        <div className="flex flex-col gap-1.5 ">
          <label className="text-xs font-medium text-slate-400">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className={inputCls}
            placeholder="Write your note here..."
          />
        </div>
      </div>
    </Modal>
  );
}

export function NoteModal({ note, onClose, onSave }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <NoteEditModal
        note={note}
        onClose={onClose}
        onBack={() => setEditing(false)}
        onSave={async (updated) => {
          await onSave(updated);
          setEditing(false);
          onClose();
        }}
      />
    );
  }

  return (
    <NoteViewModal
      note={note}
      onClose={onClose}
      onStartEdit={() => setEditing(true)}
    />
  );
}
