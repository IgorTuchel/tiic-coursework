import { useEffect } from "react";
import { LuLayers } from "react-icons/lu";

function AuthLayout({
  children,
  title,
  panelHeading,
  panelSubheading,
  panelBody,
}) {
  useEffect(() => {
    document.title = title
      ? `${title} | Inspectra`
      : "Inspectra Maintenance Console";
  }, [title]);

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Desktop left panel */}
      <div className="hidden md:flex w-1/2 flex-col justify-center bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 p-10">
        <div className="flex items-center gap-4 mb-6">
          <LuLayers className="w-12 h-12 text-slate-900" />
          <h1 className="text-4xl font-semibold text-slate-900 tracking-wide uppercase">
            Inspectra
          </h1>
        </div>
        <p className="text-slate-900/80 text-lg mb-8">{panelHeading}</p>
        <p className="max-w-md text-slate-900/80">{panelBody}</p>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="mb-8 md:hidden">
            <div className="flex items-center gap-3 mb-3">
              <LuLayers className="w-10 h-10 text-sky-500" />
              <h1 className="text-3xl font-semibold text-slate-100 tracking-wide uppercase">
                Inspectra
              </h1>
            </div>
            <p className="text-slate-400 text-sm">Maintenance Console</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
