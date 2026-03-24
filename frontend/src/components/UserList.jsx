// src/components/UserList.jsx
import React from "react";

function UserList({ users, onEdit, onDelete }) {
  if (users.length === 0) {
    return <p className="text-slate-400">No users defined yet.</p>;
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4 shadow hover:shadow-lg transition"
        >
          {/* Left: Name, Email, Role */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-slate-100">{user.name}</h3>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <span className="mt-1 px-2 py-0.5 text-xs font-medium text-sky-100 bg-sky-700/30 rounded-full w-max">
              {user.role}
            </span>
          </div>

          {/* Right: Edit/Delete buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(user)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(user.id)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-md text-sm font-medium transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserList;