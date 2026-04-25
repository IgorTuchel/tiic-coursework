import { useNavigate } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";
import { Badge } from "../reports/ReportDetailsHelpers";
import { SEVERITY_STYLES, STATUS_STYLES } from "../../utils/styles";

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-800/60">
      {[40, 200, 80, 80].map((w, i) => (
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

export function AssignedTable({ reports, loading, type }) {
  const navigate = useNavigate();
  const idKey = type === "fault" ? "faultReportID" : "maintenanceReportID";
  const route = type === "fault" ? "/app/faults" : "/app/maintenance";

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-800">
            {["ID", "Name", "Severity", "Status"].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                {h}
              </th>
            ))}
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
          ) : reports.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-12 text-center text-sm text-slate-500">
                No assigned {type === "fault" ? "fault" : "maintenance"}{" "}
                reports.
              </td>
            </tr>
          ) : (
            reports.slice(0, 6).map((r) => (
              <tr
                key={r[idKey]}
                onClick={() => navigate(`${route}/${r[idKey]}`)}
                className="group hover:bg-slate-800/40 transition-colors cursor-pointer">
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-mono text-xs text-slate-500">
                    #{String(r[idKey]).slice(-6)}
                  </span>
                </td>
                <td className="px-4 py-3.5 max-w-[260px]">
                  <p className="font-medium text-slate-200 truncate leading-snug">
                    {r.name || "Untitled"}
                  </p>
                  {r.description && (
                    <p className="text-xs text-slate-500 truncate mt-0.5 max-w-[240px]">
                      {r.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge
                    value={r.severityLevel?.severityLevelName}
                    styleMap={SEVERITY_STYLES}
                  />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge
                    value={r.reportStatus?.statusName}
                    styleMap={STATUS_STYLES}
                  />
                </td>
                <td className="px-4 py-3.5">
                  <LuChevronRight
                    size={16}
                    className="text-slate-600 group-hover:text-slate-300 transition-colors ml-auto"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
