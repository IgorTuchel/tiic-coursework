import { useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import {
  LuSearch,
  LuRefreshCw,
  LuPlus,
  LuFingerprint,
  LuUsers,
} from "react-icons/lu";
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
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-100">
              User Management
            </h1>
            <p className="text-sm text-slate-400">
              Manage accounts and role-based access.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openModal("searchById")}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2.5 text-sm text-slate-300 transition-colors">
              <LuFingerprint className="w-4 h-4" />
              Lookup by ID
            </button>
            <button
              onClick={() => openModal("create")}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors">
              <LuPlus className="w-4 h-4" />
              New User
            </button>
          </div>
        </div>

        <StatsStrip users={users} roles={roles} />

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by name or email..."
                aria-label="Filter users search bar"
                className="w-full rounded-md bg-slate-950 border border-slate-800 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button
              onClick={fetchUsers}
              title="Refresh"
              className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2.5 text-slate-300 transition-colors">
              <LuRefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Showing <span className="text-slate-300">{filtered.length}</span>{" "}
              of <span className="text-slate-300">{users.length}</span> user
              {users.length !== 1 ? "s" : ""}
              {search && (
                <span className="text-slate-400 ml-1">(filtered)</span>
              )}
            </span>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sky-400 hover:text-sky-300 transition-colors">
                Clear filter
              </button>
            )}
          </div>
        </div>

        {!loading && filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <LuUsers size={20} />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-200">
                  No users found
                </h2>
                <p className="text-sm text-slate-500 max-w-sm">
                  Try adjusting your search, or create a new user account.
                </p>
              </div>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-1 text-sm text-sky-400 hover:text-sky-300 transition-colors">
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/20">
            <UserTable
              users={filtered}
              roles={roles}
              loading={loading}
              onActionClick={(u) => openModal("actions", u)}
            />
          </div>
        )}
      </div>

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
