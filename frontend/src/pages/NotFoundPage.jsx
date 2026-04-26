import { useNavigate, useLocation } from "react-router-dom";
import { LuLayers, LuArrowLeft, LuCompass } from "react-icons/lu";

function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-3">
        <div className="flex items-center gap-2.5">
          <LuLayers className="w-5 h-5 text-sky-500" />
          <span className="text-base font-semibold tracking-wide uppercase text-slate-100">
            Inspectra
          </span>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex flex-col items-center text-center gap-6 max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
            <LuCompass size={28} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-sky-500">
              404 - Page not found
            </p>
            <h1 className="text-2xl font-semibold text-slate-100">
              Nothing here
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              The route{" "}
              <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">
                {location.pathname}
              </code>{" "}
              doesn't exist. It may have been moved, deleted, or you may not
              have permission to access it.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-sm cursor-pointer text-slate-300 transition-colors">
              <LuArrowLeft className="w-4 h-4" />
              Go back
            </button>
            <button
              onClick={() => navigate("/app/dashboard", { replace: true })}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2.5 text-sm font-semibold cursor-pointer text-white transition-colors">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
