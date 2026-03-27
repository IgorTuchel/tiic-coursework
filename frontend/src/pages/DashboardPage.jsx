// src/pages/DashboardPage.jsx
import MainLayout from "../layouts/MainLayout";

function DashboardPage() {
  return (
    <MainLayout>
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow hover:shadow-lg transition">
          <div className="text-xs font-medium text-slate-400 mb-1">Active faults</div>
          <div className="text-3xl font-bold text-slate-100 mb-1">12</div>
          <div className="text-xs text-amber-400">+3 today · high on markers 21 & 42</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow hover:shadow-lg transition">
          <div className="text-xs font-medium text-slate-400 mb-1">Tools ready</div>
          <div className="text-3xl font-bold text-slate-100 mb-1">94%</div>
          <div className="text-xs text-amber-300">3 kits missing calibration</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow hover:shadow-lg transition">
          <div className="text-xs font-medium text-slate-400 mb-1">Open alerts</div>
          <div className="text-3xl font-bold text-slate-100 mb-1">5</div>
          <div className="text-xs text-rose-300">1 critical, 4 warning</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-[2fr,1.2fr]">
        
        {/* Fault List */}
        {/* Added min-w-0 to prevent table from breaking the grid on mobile */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-100">Fault List</h2>
            <span className="text-xs text-slate-500">Live feed from AR markers</span>
          </div>

          <div className="overflow-x-auto w-full pb-2">
            {/* Added whitespace-nowrap so text doesn't squish together */}
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="text-left py-2 pr-4">Marker</th>
                  <th className="text-left py-2 pr-4">Location</th>
                  <th className="text-left py-2 pr-4">Severity</th>
                  <th className="text-left py-2 pr-4">Detected</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800 transition">
                  <td className="py-2 pr-4 font-mono text-sky-300">#21</td>
                  <td className="py-2 pr-4">Line A · Station 4</td>
                  <td className="py-2 pr-4 text-rose-400">High</td>
                  <td className="py-2 pr-4">Today · 09:14</td>
                  <td className="py-2">
                    <span className="inline-flex rounded-full bg-rose-500/20 text-rose-300 px-2 py-0.5 text-xs font-medium">
                      Awaiting intervention
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800 transition">
                  <td className="py-2 pr-4 font-mono text-sky-300">#42</td>
                  <td className="py-2 pr-4">Line B · Station 2</td>
                  <td className="py-2 pr-4 text-amber-300">Medium</td>
                  <td className="py-2 pr-4">Today · 08:51</td>
                  <td className="py-2">
                    <span className="inline-flex rounded-full bg-amber-500/20 text-amber-200 px-2 py-0.5 text-xs font-medium">
                      Technician dispatched
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-800 transition">
                  <td className="py-2 pr-4 font-mono text-sky-300">#07</td>
                  <td className="py-2 pr-4">Line A · Station 1</td>
                  <td className="py-2 pr-4 text-emerald-300">Low</td>
                  <td className="py-2 pr-4">Yesterday · 17:03</td>
                  <td className="py-2">
                    <span className="inline-flex rounded-full bg-emerald-500/20 text-emerald-200 px-2 py-0.5 text-xs font-medium">
                      Resolved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* AR Marker Activity */}
        {/* Added min-w-0 here as well for consistency */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col shadow min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-100">AR Marker Activity</h2>
            <span className="text-xs text-slate-500">Last 24 hours</span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="h-40 w-full rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-500 text-center px-4">
              Add your AR marker activity chart or mini-map here.
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;