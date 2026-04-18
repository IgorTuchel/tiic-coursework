import { LuPencil, LuShieldCheck, LuFileText, LuUserX } from "react-icons/lu";
import { Modal } from "../../Modal.jsx";

export function ActionsModal({
  user,
  onEdit,
  onViewRole,
  onViewDetails,
  onDeactivate,
  onClose,
}) {
  const isDeactivated = user.status?.statusName === "deactivated";
  return (
    <Modal
      title={`${user.firstName} ${user.lastName}`}
      subtitle={user.email}
      onClose={onClose}
      maxWidth="max-w-xs">
      <div className="space-y-1 -mx-1">
        <button
          onClick={onEdit}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
          <LuPencil className="w-4 h-4 shrink-0 text-slate-400" /> Edit user
        </button>
        <button
          onClick={onViewRole}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
          <LuShieldCheck className="w-4 h-4 shrink-0 text-slate-400" /> View
          role permissions
        </button>
        <button
          onClick={onViewDetails}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
          <LuFileText className="w-4 h-4 shrink-0 text-slate-400" /> View all
          details
        </button>
        {!isDeactivated && (
          <button
            onClick={onDeactivate}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">
            <LuUserX className="w-4 h-4 shrink-0" /> Deactivate account
          </button>
        )}
      </div>
    </Modal>
  );
}
