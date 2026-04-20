import toast from "react-hot-toast";
import { LuEllipsis } from "react-icons/lu";
import { Badge, SEVERITY_STYLES, STATUS_STYLES } from "./ReportDetailsHelpers";

export function ReportTable({ reports, loading, onActionClick }) {
  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-slate-400">No reports found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto text-sm whitespace-nowrap border-collapse">
        <thead className="bg-slate-900 border-b border-slate-800">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
              ID
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
              Title
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
              Severity
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
              Created By
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">
              Created At
            </th>
            <th className="text-left text-xs font-medium text-slate-400" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-950">
          {reports.map((report) => (
            <tr
              key={report?.reportID || report?.maintenanceReportID}
              className="hover:bg-slate-900 transition-colors">
              <td className="px-4 py-3">
                {report?.reportID || report?.maintenanceReportID}
              </td>
              <td className="px-4 py-3">{report?.title || report?.name}</td>
              <td className="px-4 py-3 {}">
                <Badge
                  value={report.severityLevel?.severityLevelName}
                  styleMap={SEVERITY_STYLES}
                />
              </td>
              <td className="px-4 py-3">
                <Badge
                  value={report.reportStatus?.statusName}
                  styleMap={STATUS_STYLES}
                />
              </td>
              <td className="px-4 py-3">
                {report.createdByUser
                  ? `${report.createdByUser.firstName} ${report.createdByUser.lastName}`
                  : "N/A"}
              </td>
              <td className="px-4 py-3">
                {report.createdAt
                  ? new Date(report.createdAt).toLocaleString()
                  : "N/A"}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <button
                    onClick={() => onActionClick(report)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="User actions">
                    <LuEllipsis className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
