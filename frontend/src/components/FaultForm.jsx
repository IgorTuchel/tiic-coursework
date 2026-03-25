import React, { useState } from "react";

function FaultForm({ markerId, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "medium",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!markerId) return;
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      severity: form.severity,
      markerId: Number(markerId),
    };

    try {
      // Mock API call
      console.log("Create fault (mock)", payload);
      onCreated && onCreated({ id: Date.now().toString(), ...payload, status: "open" });

      setForm({ title: "", description: "", severity: "medium" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to create fault.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-100">Create / Annotate Fault</h3>

      <p className="text-sm text-slate-400">
        Current marker anchor:{" "}
        {markerId ? <strong className="text-emerald-400">#{markerId}</strong> : "None"}
      </p>

      <div className="flex flex-col space-y-2">
        <label className="flex flex-col text-sm">
          <span className="font-medium text-slate-200">Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Enter fault title"
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="font-medium text-slate-200">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Describe the fault in detail"
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="font-medium text-slate-200">Severity</span>
          <select
            name="severity"
            value={form.severity}
            onChange={handleChange}
            className="mt-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {showSuccess && (
        <div className="text-green-400 bg-slate-800 border border-green-500 rounded px-3 py-2 text-sm">
          ✅ Fault successfully logged for Marker #{markerId}!
        </div>
      )}

      <button
        type="submit"
        disabled={saving || !markerId}
        className={`w-full px-4 py-2 rounded-md text-white font-medium transition ${
          saving || !markerId
            ? "bg-slate-700 cursor-not-allowed"
            : "bg-sky-600 hover:bg-sky-700"
        }`}
      >
        {saving ? "Saving..." : "Save Fault"}
      </button>
    </form>
  );
}

export default FaultForm;