import { useState } from "react";
import {
  LuSearch,
  LuPencil,
  LuShieldCheck,
  LuFileText,
  LuUserX,
} from "react-icons/lu";
import { Modal } from "../../Modal.jsx";
import { StatusBadge } from "../StatusBadge.jsx";
import { normaliseUser, resolveMfa, initials, inputCls } from "../utils.js";
import { getUserById } from "../../../services/getUsersService.js";

export function SearchByIdModal({
  roles,
  onClose,
  openModal,
  savedState,
  onSaveState,
}) {
  const [query, setQuery] = useState(savedState.query ?? "");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(savedState.result ?? null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setResult(null);
    setError(null);
    const res = await getUserById(query.trim());
    if (res.success) {
      const normalised = normaliseUser(res.data);
      setResult(normalised);
      onSaveState({ query, result: normalised });
    } else {
      setError(res.message ?? "User not found.");
    }
    setSearching(false);
  };

  const goBack = () => openModal("searchById");
  const transition = (type) => openModal(type, result, goBack);

  const isDeactivated = result?.status?.statusName === "deactivated";
  const mfa = result ? resolveMfa(result, roles) : null;

  return (
    <Modal
      title="Lookup user by ID"
      subtitle="Enter a UUID to fetch a specific user"
      onClose={onClose}
      maxWidth="max-w-sm">
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setResult(null);
              setError(null);
              onSaveState({ query: e.target.value, result: null });
            }}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className={`${inputCls} font-mono text-xs`}
          />
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="rounded-md bg-sky-500 hover:bg-sky-600 disabled:opacity-50 px-3 py-2 text-slate-950 transition-colors shrink-0">
            {searching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950" />
            ) : (
              <LuSearch className="w-4 h-4" />
            )}
          </button>
        </form>

        {error && (
          <div className="rounded-md bg-red-400/10 border border-red-400/20 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-lg bg-slate-900 border border-slate-700 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
              <div className="w-8 h-8 rounded-full bg-sky-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                {initials(result)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">
                  {result.firstName} {result.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {result.email}
                </p>
              </div>
              <div className="ml-auto shrink-0">
                <StatusBadge status={result.status?.statusName} />
              </div>
            </div>
            <div className="px-4 py-2.5 flex flex-wrap gap-x-4 gap-y-1">
              <span className="text-xs text-slate-500">
                Role:{" "}
                <span className="text-sky-400">
                  {result.role?.roleName ?? "—"}
                </span>
              </span>
              <span className="text-xs text-slate-500">
                MFA:{" "}
                <span
                  className={
                    mfa?.active ? "text-emerald-400" : "text-slate-400"
                  }>
                  {mfa?.active ? `Enabled (${mfa.source})` : "Disabled"}
                </span>
              </span>
              <span className="text-xs text-slate-500">
                ID:{" "}
                <span className="text-slate-400 font-mono">
                  {result.userID?.slice(0, 8)}…
                </span>
              </span>
            </div>
            <div className="px-3 py-2.5 border-t border-slate-700 flex flex-wrap gap-2">
              <button
                onClick={() => transition("edit")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <LuPencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => transition("role")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <LuShieldCheck className="w-3.5 h-3.5" /> Role
              </button>
              <button
                onClick={() => transition("details")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <LuFileText className="w-3.5 h-3.5" /> Details
              </button>
              {!isDeactivated && (
                <button
                  onClick={() => transition("deactivate")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">
                  <LuUserX className="w-3.5 h-3.5" /> Deactivate
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
