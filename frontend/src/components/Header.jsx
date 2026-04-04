import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  // For the prototype, we assume the username IS the role if no proper auth is set up yet
  const username = localStorage.getItem("username") || "SystemAdministrator";
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // NEW: Security Check! Only admins get to see the user management stuff.
  const isAdmin = username === "SystemAdministrator";

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <svg
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

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-slate-300 hover:text-white text-2xl focus:outline-none"
        >
          ☰
        </button>

        {/* Desktop nav & User Controls */}
        <div className="hidden sm:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1 transition-colors"}>
              Dashboard
            </NavLink>
            <NavLink to="/ar" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1 transition-colors"}>
              AR Scanner
            </NavLink>
            <NavLink to="/check-tools" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1 transition-colors"}>
              Tool Check
            </NavLink>
            
            {/* FIX: The Users tab is now protected! */}
            {isAdmin && (
              <NavLink to="/users" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1 transition-colors"}>
                Users
              </NavLink>
            )}
          </nav>

          {/* Desktop User Info & Logout */}
          <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
            <span className="text-xs text-slate-400 max-w-[120px] truncate" title={username}>
              {username}
            </span>
            <button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 text-sm border-t border-slate-800 pt-3 bg-slate-900 shadow-lg">
          <NavLink to="/dashboard" onClick={() => setOpen(false)} className="text-slate-300 py-2 hover:text-white transition-colors">Dashboard</NavLink>
          <NavLink to="/ar" onClick={() => setOpen(false)} className="text-slate-300 py-2 hover:text-white transition-colors">AR Scanner</NavLink>
          <NavLink to="/check-tools" onClick={() => setOpen(false)} className="text-slate-300 py-2 hover:text-white transition-colors">Tool Check</NavLink>
          
          {/* FIX: Mobile Users tab is also protected! */}
          {isAdmin && (
            <NavLink to="/users" onClick={() => setOpen(false)} className="text-slate-300 py-2 hover:text-white transition-colors">Users</NavLink>
          )}

          <div className="mt-2 pt-4 border-t border-slate-800 flex flex-col gap-3">
            <div className="text-xs text-slate-400">
              Signed in as <strong className="text-slate-300">{username}</strong>
            </div>
            <button onClick={handleLogout} className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors text-center shadow-md">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;