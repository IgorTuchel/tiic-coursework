import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {
  const username = localStorage.getItem("username") || "SystemAdministrator";
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = username === "SystemAdministrator";

  // 3 Stage Text Size State 
  const [textSizeLevel, setTextSizeLevel] = useState(0);

  // Injecting Tailwind classes based on current level
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-lg", "text-xl");
    
    // Apply new size
    if (textSizeLevel === 1) {
      root.classList.add("text-lg");
    } else if (textSizeLevel === 2) {
      root.classList.add("text-xl"); 
    }
  }, [textSizeLevel]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  // Helper for dynamic ARIA labels
  const getNextSizeLabel = () => {
    if (textSizeLevel === 0) return "Increase text size to large";
    if (textSizeLevel === 1) return "Increase text size to extra large";
    return "Reset text size to standard";
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        
        <Link to="/dashboard" className="flex items-center gap-3 group" aria-label="Inspectra Dashboard Home">
          <svg
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-sky-500 group-hover:text-sky-400 transition-colors"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-100 tracking-wide uppercase group-hover:text-white transition-colors">
            Inspectra
          </h1>
        </Link>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          className="sm:hidden text-slate-300 hover:text-white text-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 rounded px-2"
        >
          ☰
        </button>

        {/* Desktop nav and User Controls */}
        <div className="hidden sm:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm" aria-label="Main Navigation">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1 transition-colors"}>
              Dashboard
            </NavLink>
            <NavLink to="/ar" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1 transition-colors"}>
              AR Scanner
            </NavLink>
            <NavLink to="/check-tools" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1 transition-colors"}>
              Tool Check
            </NavLink>
            {isAdmin && (
              <NavLink to="/users" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1 transition-colors"}>
                Users
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
            
            {/* The 3 Stage Text Size Toggle Tool */}
            <button
              onClick={() => setTextSizeLevel((prev) => (prev + 1) % 3)}
              aria-label={getNextSizeLabel()}
              className="relative text-slate-400 hover:text-white flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-sky-500 focus:outline-none"
              title="Toggle Text Size"
            >
              <span aria-hidden="true" className="text-lg font-serif leading-none mt-0.5">Aa</span>
              {/* Visual dot to show which level you are on */}
              {textSizeLevel > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full" />
              )}
            </button>

            <span className="text-xs text-slate-400 max-w-[120px] truncate" title={username} aria-label={`Signed in as ${username}`}>
              {username}
            </span>
            <button 
              onClick={handleLogout} 
              aria-label="Log out of Inspectra"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-md transition-colors focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 text-sm border-t border-slate-800 pt-3 bg-slate-900 shadow-lg">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-3">
            <NavLink to="/dashboard" onClick={() => setOpen(false)} className="text-slate-300 py-2 hover:text-white transition-colors block">Dashboard</NavLink>
            <NavLink to="/ar" onClick={() => setOpen(false)} className="text-slate-300 py-2 hover:text-white transition-colors block">AR Scanner</NavLink>
            <NavLink to="/check-tools" onClick={() => setOpen(false)} className="text-slate-300 py-2 hover:text-white transition-colors block">Tool Check</NavLink>
            {isAdmin && (
              <NavLink to="/users" onClick={() => setOpen(false)} className="text-slate-300 py-2 hover:text-white transition-colors block">Users</NavLink>
            )}
          </nav>

          <div className="mt-2 pt-4 border-t border-slate-800 flex flex-col gap-3">
            
            {/* Mobile 3 Stage  Text Size Toggle Tool */}
            <button
              onClick={() => setTextSizeLevel((prev) => (prev + 1) % 3)}
              className="flex items-center justify-center gap-2 bg-slate-800 text-slate-300 py-2 rounded-md hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <span aria-hidden="true" className="font-serif">Aa</span>
              {textSizeLevel === 0 ? "Standard Text" : textSizeLevel === 1 ? "Large Text" : "Extra Large Text"}
            </button>

            <div className="text-xs text-slate-400 text-center mt-2">
              Signed in as <strong className="text-slate-300">{username}</strong>
            </div>
            <button 
              onClick={handleLogout} 
              className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors text-center shadow-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;