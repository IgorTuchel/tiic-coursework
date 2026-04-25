import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuRefreshCcw } from "react-icons/lu";
import MainLayout from "../layouts/MainLayout";
import { AuthContext } from "../context/AuthContext";
import { StatCard } from "../components/dashboard/StatCard";
import { AssignedTable } from "../components/dashboard/AssignedTable";
import { useDashboardPermissions } from "../hooks/useDashboardPermissions";
import {
  useDashboardData,
  getOpen,
  getClosed,
} from "../hooks/useDashboardData";

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    canSeeFaults,
    canSeeAllFaults,
    canSeeReports,
    canSeeAllReports,
    isPrivileged,
  } = useDashboardPermissions();

  const {
    loading,
    fetchData,
    myFaults,
    allFaults,
    myMaintenance,
    allMaintenance,
    assignedFaults,
    assignedMaintenance,
    assignedTotal,
  } = useDashboardData({
    canSeeFaults,
    canSeeAllFaults,
    canSeeReports,
    canSeeAllReports,
  });

  const tableColClass =
    canSeeFaults && canSeeReports ? "md:grid-cols-2" : "md:grid-cols-1";

  return (
    <MainLayout title="Dashboard">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Here's an overview of your current reports.
          </p>
        </div>
        <button
          onClick={fetchData}
          title="Refresh"
          className="rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-slate-300 transition-colors">
          <LuRefreshCcw size={16} />
        </button>
      </div>

      {isPrivileged ? (
        <div className="space-y-6 mb-6">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
              System overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {canSeeAllFaults && (
                <StatCard
                  label="Open fault reports"
                  open={getOpen(allFaults, "fault")}
                  closed={getClosed(allFaults, "fault")}
                  loading={loading}
                />
              )}
              {canSeeAllReports && (
                <StatCard
                  label="Open maintenance reports"
                  open={getOpen(allMaintenance, "maintenance")}
                  closed={getClosed(allMaintenance, "maintenance")}
                  loading={loading}
                />
              )}
              <StatCard
                label="Assigned to me"
                open={assignedTotal}
                closed={null}
                loading={loading}
              />
            </div>
          </div>

          {(canSeeFaults || canSeeReports) && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
                My reports
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {canSeeFaults && (
                  <StatCard
                    label="My open fault reports"
                    open={getOpen(myFaults, "fault")}
                    closed={getClosed(myFaults, "fault")}
                    loading={loading}
                  />
                )}
                {canSeeReports && (
                  <StatCard
                    label="My open maintenance reports"
                    open={getOpen(myMaintenance, "maintenance")}
                    closed={getClosed(myMaintenance, "maintenance")}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        (canSeeFaults || canSeeReports) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {canSeeFaults && (
              <StatCard
                label="My open fault reports"
                open={getOpen(myFaults, "fault")}
                closed={getClosed(myFaults, "fault")}
                loading={loading}
              />
            )}
            {canSeeReports && (
              <StatCard
                label="My open maintenance reports"
                open={getOpen(myMaintenance, "maintenance")}
                closed={getClosed(myMaintenance, "maintenance")}
                loading={loading}
              />
            )}
            <StatCard
              label="Assigned to me"
              open={assignedTotal}
              closed={null}
              loading={loading}
            />
          </div>
        )
      )}

      {(canSeeFaults || canSeeReports) && (
        <div className={`grid gap-6 ${tableColClass}`}>
          {canSeeFaults && (
            <section className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/20">
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <h2 className="text-sm font-semibold text-slate-100">
                  Assigned Fault Reports
                </h2>
                <button
                  onClick={() => navigate("/app/faults")}
                  className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
                  View all →
                </button>
              </div>
              <AssignedTable
                reports={assignedFaults}
                loading={loading}
                type="fault"
              />
            </section>
          )}

          {canSeeReports && (
            <section className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/20">
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <h2 className="text-sm font-semibold text-slate-100">
                  Assigned Maintenance Reports
                </h2>
                <button
                  onClick={() => navigate("/app/maintenance")}
                  className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
                  View all →
                </button>
              </div>
              <AssignedTable
                reports={assignedMaintenance}
                loading={loading}
                type="maintenance"
              />
            </section>
          )}
        </div>
      )}
    </MainLayout>
  );
}

export default DashboardPage;
