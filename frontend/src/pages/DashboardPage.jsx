// src/pages/DashboardPage.jsx
import React from "react";
import { Link } from "react-router-dom";

function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold tracking-widest text-sky-400">
            AR
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-semibold">Inspectra</h1>
            <span className="text-xs text-slate-500">Maintenance Console</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">Signed in as maintenance.tech</span>
          <Link
            to="/"
            className="rounded-md border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800"
          >
            Sign out
          </Link>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[220px] rounded-xl bg-slate-900 border border-slate-800 p-4">
            <div className="text-xs font-medium text-slate-400 mb-2">
              Active faults
            </div>
            <div className="text-3xl font-semibold mb-1">12</div>
            <div className="text-xs text-amber-400">
              +3 today · high on markers 21 & 42
            </div>
          </div>

          <div className="flex-1 min-w-[220px] rounded-xl bg-slate-900 border border-slate-800 p-4">
            <div className="text-xs font-medium text-slate-400 mb-2">
              Tools ready
            </div>
            <div className="text-3xl font-semibold mb-1">94%</div>
            <div className="text-xs text-amber-300">
              3 kits missing calibration
            </div>
          </div>

          <div className="flex-1 min-w-[220px] rounded-xl bg-slate-900 border border-slate-800 p-4">
            <div className="text-xs font-medium text-slate-400 mb-2">
              Open alerts
            </div>
            <div className="text-3xl font-semibold mb-1">5</div>
            <div className="text-xs text-rose-300">
              1 critical, 4 warning
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
          <section className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-100">
                Fault list
              </h2>
              <span className="text-xs text-slate-500">
                Live feed from AR markers
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
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
                  <tr>
                    <td className="py-2 pr-4 font-mono text-sky-300">
                      #21
                    </td>
                    <td className="py-2 pr-4">Line A · Station 4</td>
                    <td className="py-2 pr-4 text-rose-400">High</td>
                    <td className="py-2 pr-4">Today · 09:14</td>
                    <td className="py-2">
                      <span className="inline-flex rounded-full bg-rose-500/15 text-rose-300 px-2 py-0.5 text-[11px]">
                        Awaiting intervention
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-sky-300">
                      #42
                    </td>
                    <td className="py-2 pr-4">Line B · Station 2</td>
                    <td className="py-2 pr-4 text-amber-300">Medium</td>
                    <td className="py-2 pr-4">Today · 08:51</td>
                    <td className="py-2">
                      <span className="inline-flex rounded-full bg-amber-500/15 text-amber-200 px-2 py-0.5 text-[11px]">
                        Technician dispatched
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-sky-300">
                      #07
                    </td>
                    <td className="py-2 pr-4">Line A · Station 1</td>
                    <td className="py-2 pr-4 text-emerald-300">Low</td>
                    <td className="py-2 pr-4">Yesterday · 17:03</td>
                    <td className="py-2">
                      <span className="inline-flex rounded-full bg-emerald-500/15 text-emerald-200 px-2 py-0.5 text-[11px]">
                        Resolved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              Plug your existing fault list / table here.
            </p>
          </section>

          <section className="rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-100">
                AR marker activity
              </h2>
              <span className="text-xs text-slate-500">Last 24 hours</span>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="h-32 w-full rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-500">
                Add your AR marker activity, map or mini‑chart here.
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
