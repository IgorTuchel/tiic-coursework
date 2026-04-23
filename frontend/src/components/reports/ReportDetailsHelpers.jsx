import { useState } from "react";
import { LuX, LuPlus } from "react-icons/lu";
import { inputCls } from "../../utils/styles";

export function Badge({ value, styleMap }) {
  const styles =
    styleMap[value?.toLowerCase()] ??
    "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles}`}>
      {value ?? "N/A"}
    </span>
  );
}

export function MetaItem({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-1.5 rounded-md bg-slate-800 text-slate-400">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <div className="text-sm text-slate-300">{children}</div>
      </div>
    </div>
  );
}

export function AssignedUsersSection({
  assignedUsers,
  availableUsers,
  onAdd,
  onRemove,
}) {
  const [showSelect, setShowSelect] = useState(false);
  const assignedIDs = new Set(assignedUsers.map((u) => u.userID));
  const unassigned = availableUsers.filter((u) => !assignedIDs.has(u.userID));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">
          Assigned Users{" "}
          {assignedUsers.length > 0 && (
            <span className="text-xs text-slate-500 font-normal">
              {assignedUsers.length}
            </span>
          )}
        </p>
        {onAdd && unassigned.length > 0 && (
          <button
            onClick={() => setShowSelect((v) => !v)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors">
            <LuPlus className="w-3.5 h-3.5" /> Add
          </button>
        )}
      </div>

      {showSelect && (
        <select
          className={inputCls}
          defaultValue=""
          onChange={(e) => {
            const user = unassigned.find((u) => u.userID === e.target.value);
            if (user) {
              onAdd(user);
              setShowSelect(false);
            }
          }}>
          <option value="" disabled>
            Select a user...
          </option>
          {unassigned.map((u) => (
            <option key={u.userID} value={u.userID}>
              {u.firstName} {u.lastName} — {u.email}
            </option>
          ))}
        </select>
      )}

      {assignedUsers.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {assignedUsers.map((user) => (
            <div
              key={user.userID}
              className="flex items-center justify-between rounded-lg bg-slate-800/50 border border-slate-800 px-3 py-2">
              <div>
                <p className="text-sm text-slate-200">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              {onRemove && (
                <button
                  onClick={() => onRemove(user)}
                  className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-slate-700 transition-colors"
                  aria-label={`Remove ${user.firstName}`}>
                  <LuX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No users assigned.</p>
      )}
    </div>
  );
}

export function ToolChecksSection({
  toolChecks,
  availableTools,
  onAdd,
  onRemove,
}) {
  const [showSelect, setShowSelect] = useState(false);
  const assignedIDs = new Set(toolChecks.map((t) => t.toolID));
  const unassigned = availableTools.filter((t) => !assignedIDs.has(t.toolID));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">
          Tools Required{" "}
          {toolChecks.length > 0 && (
            <span className="text-xs text-slate-500 font-normal">
              {toolChecks.length}
            </span>
          )}
        </p>
        {onAdd && unassigned.length > 0 && (
          <button
            onClick={() => setShowSelect((v) => !v)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors">
            <LuPlus className="w-3.5 h-3.5" /> Add
          </button>
        )}
      </div>

      {showSelect && (
        <select
          className={inputCls}
          defaultValue=""
          onChange={(e) => {
            const tool = unassigned.find((t) => t.toolID === e.target.value);
            if (tool) {
              onAdd(tool);
              setShowSelect(false);
            }
          }}>
          <option value="" disabled>
            Select a tool...
          </option>
          {unassigned.map((t) => (
            <option key={t.toolID} value={t.toolID}>
              {t.name}
            </option>
          ))}
        </select>
      )}

      {toolChecks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {toolChecks.map((tool) => (
            <span
              key={tool.toolID}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 pl-3 pr-1.5 py-1 text-xs text-slate-300">
              {tool.name}
              {onRemove && (
                <button
                  onClick={() => onRemove(tool)}
                  className="rounded-full p-0.5 text-slate-500 hover:text-red-400 transition-colors"
                  aria-label={`Remove ${tool.name}`}>
                  <LuX className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No tools assigned.</p>
      )}
    </div>
  );
}
