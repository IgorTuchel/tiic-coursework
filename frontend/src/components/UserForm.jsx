// src/components/UserForm.jsx
import React, { useEffect, useState } from "react";

function UserForm({ mode = "create", initialUser, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "MaintenanceEngineer",
    password: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialUser) {
      setForm({
        name: initialUser.name,
        email: initialUser.email,
        role: initialUser.role,
        password: "",
      });
    }
  }, [mode, initialUser]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm space-y-4"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg font-semibold text-slate-100">
        {mode === "create" ? "Create New User" : "Edit User"}
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-slate-300 text-sm">
          Full Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
        </label>

        <label className="flex flex-col text-slate-300 text-sm">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-slate-300 text-sm">
          Role
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="MaintenanceEngineer">Maintenance Engineer</option>
            <option value="MaintenanceTechnician">Maintenance Technician</option>
            <option value="SecurityAnalyst">Security Analyst</option>
            <option value="SecurityAdministrator">Security Administrator</option>
            <option value="DataAnalyst">Data Analyst</option>
            <option value="AuthorisedPersonnel">Authorised Personnel</option>
            <option value="SystemAdministrator">System Administrator</option>
          </select>
        </label>

        <label className="flex flex-col text-slate-300 text-sm">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={mode === "edit" ? "Leave blank to keep current" : ""}
            required={mode === "create"}
            className="mt-1 p-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </label>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-slate-700 text-slate-200 hover:bg-slate-600"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-sky-500 text-white hover:bg-sky-600"
        >
          {mode === "create" ? "Create User" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default UserForm;