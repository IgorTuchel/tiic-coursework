import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export function ErrorLogPagination({
  pagination,
  onPageChange,
  limit,
  onLimitChange,
}) {
  if (!pagination) return null;
  const { page, totalPages, total } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
      <div className="flex items-center gap-3">
        <span>
          Showing {from}–{to} of {total}
        </span>
        <div className="flex items-center gap-1.5">
          <span>Rows:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded bg-slate-900 border border-slate-700 px-1.5 py-1 text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500">
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span>Page</span>
            <input
              type="number"
              aria-label="Current Page"
              min={1}
              max={totalPages}
              value={page}
              onChange={(e) => {
                const val = Math.max(
                  1,
                  Math.min(totalPages, Number(e.target.value)),
                );
                if (val !== page) onPageChange(val);
              }}
              className="w-12 rounded bg-slate-900 border border-slate-700 px-1.5 py-1 text-center text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <span>of {totalPages}</span>
          </div>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!pagination.hasPrevPage}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <LuChevronLeft className="w-4 h-4" aria-label="Previous Page" />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!pagination.hasNextPage}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <LuChevronRight className="w-4 h-4" aria-label="Next Page" />
          </button>
        </div>
      )}
    </div>
  );
}
