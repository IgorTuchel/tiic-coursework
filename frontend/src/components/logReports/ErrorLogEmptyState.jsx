import { LuFileSearch } from "react-icons/lu";

export function ErrorLogEmptyState({ activeFilterCount, onClear }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
          <LuFileSearch size={20} />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-slate-200">
            No logs found
          </h2>
          <p className="text-sm text-slate-500 max-w-md">
            Try adjusting your search or filters.
          </p>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClear}
            className="mt-1 text-sm text-sky-400 hover:text-sky-300 transition-colors">
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
