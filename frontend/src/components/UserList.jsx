// src/components/UserList.jsx
import React from "react";

function UserList({ users, onEdit, onDelete }) {
  // Premium Empty State
  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/40 border border-slate-800 border-dashed rounded-xl shadow-sm">
        <svg
          className="w-12 h-12 text-slate-700 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-slate-200 mb-1">No users found</h3>
        <p className="text-sm text-slate-500 text-center max-w-sm">
          There are currently no users registered in the system. Create a new user above to assign roles and maintenance access.
        </p>
      </div>
    );
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