function DashboardPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Maintenance Dashboard
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Overview of faults, repairs and tool activity (prototype view).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          Fault statistics (placeholder)
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          Tool usage (placeholder)
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          Alerts & unusual activity (placeholder)
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
