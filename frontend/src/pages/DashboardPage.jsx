// src/pages/DashboardPage.jsx
import MainLayout from "../layouts/MainLayout";

function DashboardPage() {
  return (
    <MainLayout title="Dashboard">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 cursor-default group">
          <div className="text-xs font-medium text-slate-400 mb-1 group-hover:text-sky-400 transition-colors">
            Active faults
          </div>
          <div className="text-3xl font-bold text-slate-100 mb-1">12</div>
          <div className="text-xs text-amber-400">
            +3 today · high on markers 21 & 42
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 cursor-default group">
          <div className="text-xs font-medium text-slate-400 mb-1 group-hover:text-sky-400 transition-colors">
            Tools ready
          </div>
          <div className="text-3xl font-bold text-slate-100 mb-1">94%</div>
          <div className="text-xs text-amber-300">
            3 kits missing calibration
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 cursor-default group">
          <div className="text-xs font-medium text-slate-400 mb-1 group-hover:text-sky-400 transition-colors">
            Open alerts
          </div>
          <div className="text-3xl font-bold text-slate-100 mb-1">5</div>
          <div className="text-xs text-rose-300">1 critical, 4 warning</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-[2fr,1.2fr]">
        {/* Fault List */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-100">Fault List</h2>
            <span className="text-xs text-slate-500">
              Live feed from AR markers
            </span>
          </div>

          <div className="overflow-x-auto w-full pb-2">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="text-left py-2 pr-4 font-medium">Marker</th>
                  <th className="text-left py-2 pr-4 font-medium">Location</th>
                  <th className="text-left py-2 pr-4 font-medium">Severity</th>
                  <th className="text-left py-2 pr-4 font-medium">Detected</th>
                  <th className="text-left py-2 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-sky-300">#21</td>
                  <td className="py-2.5 pr-4 text-slate-200">
                    Line A · Station 4
                  </td>
                  <td className="py-2.5 pr-4 text-rose-400 font-medium">
                    High
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400">Today · 09:14</td>
                  <td className="py-2.5">
                    <span className="inline-flex rounded-full bg-rose-500/15 text-rose-300 px-2.5 py-0.5 text-[11px] font-medium tracking-wide">
                      Awaiting intervention
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-sky-300">#42</td>
                  <td className="py-2.5 pr-4 text-slate-200">
                    Line B · Station 2
                  </td>
                  <td className="py-2.5 pr-4 text-amber-300 font-medium">
                    Medium
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400">Today · 08:51</td>
                  <td className="py-2.5">
                    <span className="inline-flex rounded-full bg-amber-500/15 text-amber-200 px-2.5 py-0.5 text-[11px] font-medium tracking-wide">
                      Technician dispatched
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-sky-300">#07</td>
                  <td className="py-2.5 pr-4 text-slate-200">
                    Line A · Station 1
                  </td>
                  <td className="py-2.5 pr-4 text-emerald-300 font-medium">
                    Low
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400">
                    Yesterday · 17:03
                  </td>
                  <td className="py-2.5">
                    <span className="inline-flex rounded-full bg-emerald-500/15 text-emerald-200 px-2.5 py-0.5 text-[11px] font-medium tracking-wide">
                      Resolved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* AR Marker Activity Chart */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col shadow-sm hover:shadow-lg hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-slate-100">
              Marker Activity
            </h2>
            <span className="text-xs text-slate-500">Last 7 Days</span>
          </div>

          <div className="h-48 w-full flex items-end justify-between gap-2 border-b border-slate-800">
            {[40, 70, 45, 90, 65, 30, 80].map((height, i) => (
              <div
                key={i}
                className="w-full max-w-[2.5rem] bg-sky-500/20 hover:bg-sky-500/40 border-t border-x border-sky-500/30 rounded-t-md transition-all duration-300 relative group"
                style={{ height: `${height}%` }}>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {height} alerts
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between w-full mt-3 text-xs text-slate-500 font-medium px-1 sm:px-3">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;
