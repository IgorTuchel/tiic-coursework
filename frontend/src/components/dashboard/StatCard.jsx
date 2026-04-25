export function StatCard({ label, open, closed, loading }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200 cursor-default group flex flex-col gap-3">
      <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors leading-snug">
        {label}
      </span>
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-9 w-16 bg-slate-800 rounded" />
          <div className="h-3 w-24 bg-slate-800 rounded" />
        </div>
      ) : (
        <>
          <div className="text-4xl font-bold text-slate-100 tabular-nums leading-none">
            {open ?? "—"}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-400">{open ?? 0} open</span>
            </span>
            {closed != null && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                <span className="text-slate-500">{closed} closed</span>
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
