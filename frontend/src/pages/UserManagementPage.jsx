// src/pages/UserManagementPage.jsx
import React, { useState } from "react";
import UserForm from "../components/UserForm.jsx";
import UserList from "../components/UserList.jsx";
import AccessControlInfo from "../components/AccessControlInfo.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

// Page for FR14–FR15: user accounts and role-based access control (frontend)
function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const handleCreateUser = (userData) => {
    const newUser = {
      id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedData) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? { ...u, name: updatedData.name, email: updatedData.email, role: updatedData.role }
          : u
      )
    );
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-sm text-slate-400 mt-1">
            Create, update, and delete users, and manage role-based access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left panel: Form + Access info */}
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
              {editingUser ? (
                <UserForm
                  mode="edit"
                  initialUser={editingUser}
                  onSubmit={handleUpdateUser}
                  onCancel={() => setEditingUser(null)}
                />
              ) : (
                <UserForm mode="create" onSubmit={handleCreateUser} />
              )}
            </div>

            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
              <AccessControlInfo />
            </div>
          </div>

          {/* Right panel: User list */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <UserList
              users={users}
              onEdit={(user) => setEditingUser(user)}
              onDelete={handleDeleteUser}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default UserManagementPage;