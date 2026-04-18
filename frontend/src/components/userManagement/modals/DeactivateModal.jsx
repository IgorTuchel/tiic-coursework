import { Modal } from "../../Modal.jsx";

export function DeactivateModal({ user, onConfirm, onCancel, onBack }) {
  return (
    <Modal
      title="Deactivate account?"
      onClose={onCancel}
      onBack={onBack}
      maxWidth="max-w-sm"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-md bg-red-600 hover:bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors">
            Deactivate
          </button>
        </div>
      }>
      <p className="text-sm text-slate-400">
        <span className="text-slate-200 font-medium">
          {user.firstName} {user.lastName}
        </span>{" "}
        ({user.email}) will lose access immediately. This can be reversed by
        editing the user's status.
      </p>
    </Modal>
  );
}
