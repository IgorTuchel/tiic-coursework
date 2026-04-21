// import toast from "react-hot-toast";
// import { LuEllipsis } from "react-icons/lu";
// import { Badge, SEVERITY_STYLES, STATUS_STYLES } from "./ReportDetailsHelpers";

// export function ReportTable({ reports, loading, onActionClick }) {
//   if (loading) {
//     return (
//       <div className="min-h-[200px] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
//           <p className="text-slate-400">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (reports.length === 0) {
//     return (
//       <div className="min-h-[200px] flex items-center justify-center">
//         <p className="text-slate-400">No reports found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto w-full">
//       <table className="w-full table-auto text-sm whitespace-nowrap border-collapse">
//         <thead className="bg-slate-900 border-b border-slate-800">
//           <tr>
//             <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
//               ID
//             </th>
//             <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
//               Title
//             </th>
//             <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
//               Severity
//             </th>
//             <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
//               Status
//             </th>
//             <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
//               Created By
//             </th>
//             <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
//               Created At
//             </th>
//             <th className="text-left text-xs font-medium text-slate-400" />
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-800 bg-slate-950">
//           {reports.map((report) => (
//             <tr
//               key={report?.reportID || report?.maintenanceReportID}
//               className="hover:bg-slate-900 transition-colors">
//               <td className="px-4 py-3">
//                 {report?.reportID || report?.maintenanceReportID}
//               </td>
//               <td className="px-4 py-3">{report?.title || report?.name}</td>
//               <td className="px-4 py-3 {}">
//                 <Badge
//                   value={report.severityLevel?.severityLevelName}
//                   styleMap={SEVERITY_STYLES}
//                 />
//               </td>
//               <td className="px-4 py-3">
//                 <Badge
//                   value={report.reportStatus?.statusName}
//                   styleMap={STATUS_STYLES}
//                 />
//               </td>
//               <td className="px-4 py-3">
//                 {report.createdByUser
//                   ? `${report.createdByUser.firstName} ${report.createdByUser.lastName}`
//                   : "N/A"}
//               </td>
//               <td className="px-4 py-3">
//                 {report.createdAt
//                   ? new Date(report.createdAt).toLocaleString()
//                   : "N/A"}
//               </td>
//               <td className="px-4 py-3">
//                 <div className="flex justify-end">
//                   <button
//                     onClick={() => onActionClick(report)}
//                     className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
//                     aria-label="User actions">
//                     <LuEllipsis className="w-4 h-4" />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { LuArrowRight, LuChevronRight } from "react-icons/lu";
import { Badge, SEVERITY_STYLES, STATUS_STYLES } from "./ReportDetailsHelpers";

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-800/60">
      {[40, 200, 80, 80, 120, 100].map((w, i) => (
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

export function ReportTable({ reports, loading, onActionClick }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              ID
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Title
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Severity
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Created By
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Created At
            </th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800/60">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          ) : reports.length === 0 ? (
            // Empty state handled by parent, but keep a minimal inline fallback
            <tr>
              <td
                colSpan={7}
                className="px-4 py-12 text-center text-sm text-slate-500">
                No reports found.
              </td>
            </tr>
          ) : (
            reports.map((report) => {
              const id = report?.maintenanceReportID || report?.reportID;
              const title = report?.name || report?.title || "Untitled";
              const creator = report.createdByUser
                ? `${report.createdByUser.firstName} ${report.createdByUser.lastName}`
                : "—";
              const date = report.createdAt
                ? new Date(report.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—";
              const time = report.createdAt
                ? new Date(report.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null;

              return (
                <tr
                  key={id}
                  onClick={() => onActionClick(report)}
                  className="group hover:bg-slate-800/40 transition-colors cursor-pointer">
                  {/* ID */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-slate-500">
                      #{String(id).slice(-6)}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3.5 max-w-[260px]">
                    <p className="font-medium text-slate-200 truncate leading-snug">
                      {title}
                    </p>
                    {report.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5 max-w-[240px]">
                        {report.description}
                      </p>
                    )}
                  </td>

                  {/* Severity */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge
                      value={report.severityLevel?.severityLevelName}
                      styleMap={SEVERITY_STYLES}
                    />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge
                      value={report.reportStatus?.statusName}
                      styleMap={STATUS_STYLES}
                    />
                  </td>

                  {/* Creator */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-slate-300 text-sm">{creator}</span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-slate-300 text-sm">{date}</span>
                    {time && (
                      <span className="block text-xs text-slate-500 mt-0.5">
                        {time}
                      </span>
                    )}
                  </td>

                  {/* Action chevron */}
                  <td className="px-4 py-3.5">
                    <LuChevronRight
                      size={16}
                      className="text-slate-600 group-hover:text-slate-300 transition-colors ml-auto"
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
