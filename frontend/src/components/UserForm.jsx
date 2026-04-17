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

  // Password Strength Calculation 
  const calculateStrength = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = calculateStrength(form.password);

  const getStrengthBarWidth = () => {
    if (strength === 0) return "w-0";
    if (strength === 1) return "w-1/4";
    if (strength === 2) return "w-2/4";
    if (strength === 3) return "w-3/4";
    return "w-full";
  };

  const getStrengthColor = () => {
    if (strength <= 1) return "bg-rose-500";
    if (strength === 2) return "bg-amber-400";
    return "bg-emerald-500";
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
            className="mt-1 p-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
            className="mt-1 p-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
            className="mt-1 p-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
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

        <div className="flex flex-col text-slate-300 text-sm">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={mode === "edit" ? "Leave blank to keep current" : ""}
            required={mode === "create"}
            className="mt-1 p-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          
          {/* Visual Password Strength Meter */}
          {(form.password.length > 0 || mode === "create") && (
            <div className="mt-2 w-full pr-1">
              <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700">
                <div className={`h-full transition-all duration-300 ${getStrengthBarWidth()} ${getStrengthColor()}`} />
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                {strength === 0 ? "Requires 8+ chars, numbers & symbols" : strength <= 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-md font-medium bg-sky-600 text-white hover:bg-sky-500 transition-colors"
        >
          {mode === "create" ? "Create User" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default UserForm;