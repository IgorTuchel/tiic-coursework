import { LuChevronRight } from "react-icons/lu";

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-800/60">
      {[120, 160, 90, 70, 120, 130, 90].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-3.5 rounded bg-slate-800 animate-pulse"
            style={{ width: w }}
          />
        </td>
      ))}
      <td className="px-4 py-3.5">
        <div className="h-3.5 w-3.5 rounded bg-slate-800 animate-pulse ml-auto" />
      </td>
    </tr>
  );
}

export function SecurityLogTable({
  logs,
  loading,
  onDetailsClick,
  onUserClick,
}) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-800">
            {[
              "Error ID",
              "Error Name",
              "Status Code",
              "HTTP Status",
              "HTTP Details",
              "User ID",
              "Timestamp",
            ].map((title) => (
              <th
                key={title}
                className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                {title}
              </th>
            ))}
            <th
              className="px-4 py-3 w-10"
              aria-label="click to enter details"
            />
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800/60">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          ) : logs.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-12 text-center text-sm text-slate-500">
                No logs found.
              </td>
            </tr>
          ) : (
            logs.map((log) => {
              const date = log.timestamp
                ? new Date(log.timestamp).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—";
              const time = log.timestamp
                ? new Date(log.timestamp).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : null;

              return (
                <tr
                  key={log.errorID}
                  onClick={() => onDetailsClick(log)}
                  className="group hover:bg-slate-800/40 transition-colors cursor-pointer">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-slate-500">
                      #{log.errorID.slice(-6)}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 max-w-[200px]">
                    <p className="font-medium text-slate-200 truncate leading-snug">
                      {log.errorName}
                    </p>
                    {log.message && (
                      <p className="text-xs text-slate-500 truncate mt-0.5 max-w-[180px]">
                        {log.message}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-slate-300">
                      {log.statusCode ?? "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className="font-mono text-xs text-slate-300"
                      aria-label="HTTP status">
                      {log.httpStatusCode ?? "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      aria-label="view HTTP request details"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDetailsClick(log);
                      }}
                      className="font-mono text-xs text-slate-300 hover:text-white transition-colors">
                      {log.method} {log.url}
                    </button>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {log.userID ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUserClick(log.userID);
                        }}
                        className="font-mono text-xs text-sky-400 hover:text-sky-300 hover:underline transition-colors">
                        #{log.userID.slice(-8)}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-sm text-slate-300">{date}</span>
                    {time && (
                      <span className="block text-xs text-slate-500 mt-0.5">
                        {time}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <LuChevronRight
                      size={16}
                      className="text-slate-600 group-hover:text-slate-300 transition-colors ml-auto"
                      aria-label="Go to log details"
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
