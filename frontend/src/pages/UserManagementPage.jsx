import { useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { LuSearch, LuRefreshCw, LuPlus, LuFingerprint } from "react-icons/lu";
import { useUserManagement } from "../hooks/useUserManagement.js";
import {
  StatsStrip,
  UserTable,
  ActionsModal,
  SearchByIdModal,
  UserModal,
  RoleModal,
  DetailsModal,
  DeactivateModal,
} from "../components/userManagement/index.js";

function UserManagementPage() {
  const [search, setSearch] = useState("");

  const {
    users,
    roles,
    statuses,
    loading,
    modal,
    activeUser,
    onBack,
    searchState,
    setSearchState,
    openModal,
    closeModal,
    fetchUsers,
    handleCreate,
    handleUpdate,
    handleDeactivate,
  } = useUserManagement();

  const filtered = users.filter(
    (u) =>
      !search ||
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <MainLayout title="User Management">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              User Management
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage accounts and role-based access.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openModal("searchById")}
              className="inline-flex items-center gap-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-sm text-slate-300 transition-colors shrink-0">
              <LuFingerprint className="w-4 h-4" /> Lookup by ID
            </button>
            <button
              onClick={() => openModal("create")}
              className="inline-flex items-center gap-2 rounded-md bg-sky-500 hover:bg-sky-600 px-3 py-2 text-sm font-medium text-slate-950 transition-colors shrink-0">
              <LuPlus className="w-4 h-4" /> New user
            </button>
          </div>
        </div>

        <StatsStrip users={users} roles={roles} />

        {/* Search / refresh */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or email..."
              className="w-full rounded-md bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            onClick={fetchUsers}
            title="Refresh"
            className="rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-slate-300 transition-colors">
            <LuRefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Table of users */}
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <UserTable
            users={filtered}
            roles={roles}
            loading={loading}
            onActionClick={(u) => openModal("actions", u)}
          />
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-slate-500">
            Showing {filtered.length} of {users.length} user
            {users.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* modals */}
      {modal === "searchById" && (
        <SearchByIdModal
          roles={roles}
          onClose={closeModal}
          openModal={openModal}
          savedState={searchState}
          onSaveState={setSearchState}
        />
      )}
      {modal === "actions" && activeUser && (
        <ActionsModal
          user={activeUser}
          onEdit={() =>
            openModal("edit", undefined, () => openModal("actions"))
          }
          onViewRole={() =>
            openModal("role", undefined, () => openModal("actions"))
          }
          onViewDetails={() =>
            openModal("details", undefined, () => openModal("actions"))
          }
          onDeactivate={() =>
            openModal("deactivate", undefined, () => openModal("actions"))
          }
          onClose={closeModal}
        />
      )}
      {modal === "create" && (
        <UserModal
          mode="create"
          roles={roles}
          statuses={statuses}
          onSubmit={handleCreate}
          onClose={closeModal}
        />
      )}
      {modal === "edit" && activeUser && (
        <UserModal
          mode="edit"
          user={activeUser}
          roles={roles}
          statuses={statuses}
          onSubmit={handleUpdate}
          onClose={closeModal}
          onBack={onBack ?? undefined}
        />
      )}
      {modal === "deactivate" && activeUser && (
        <DeactivateModal
          user={activeUser}
          onConfirm={handleDeactivate}
          onCancel={closeModal}
          onBack={onBack ?? undefined}
        />
      )}
      {modal === "role" && activeUser && (
        <RoleModal
          user={activeUser}
          roles={roles}
          onClose={closeModal}
          onBack={onBack ?? undefined}
        />
      )}
      {modal === "details" && activeUser && (
        <DetailsModal
          user={activeUser}
          roles={roles}
          onClose={closeModal}
          onBack={onBack ?? undefined}
        />
      )}
    </MainLayout>
  );
}

export default UserManagementPage;
