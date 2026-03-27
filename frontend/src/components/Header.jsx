import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/hero.png";

function Header() {
  const username = localStorage.getItem("username") || "SystemAdministrator";
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add the auth logout logic here later
    navigate("/");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src={logo} className="h-8 w-8 object-contain" alt="Inspectra Logo" />
          <h1 className="text-lg sm:text-xl font-semibold">Inspectra</h1>
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
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1"}>
              Dashboard
            </NavLink>
            <NavLink to="/ar" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1"}>
              AR Scanner
            </NavLink>
            <NavLink to="/check-tools" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1"}>
              Tool Check
            </NavLink>
            <NavLink to="/users" className={({ isActive }) => isActive ? "text-white font-semibold border-b-2 border-sky-500 pb-1" : "text-slate-400 hover:text-white pb-1"}>
              Users
            </NavLink>
          </nav>

          {/* Desktop User Info & Logout */}
          <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
            <span className="text-xs text-slate-400 max-w-[120px] truncate" title={username}>
              {username}
            </span>
            <button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-md transition">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 text-sm border-t border-slate-800 pt-3 bg-slate-900">
          <NavLink to="/dashboard" onClick={() => setOpen(false)} className="text-slate-300 py-2">Dashboard</NavLink>
          <NavLink to="/ar" onClick={() => setOpen(false)} className="text-slate-300 py-2">AR Scanner</NavLink>
          <NavLink to="/check-tools" onClick={() => setOpen(false)} className="text-slate-300 py-2">Tool Check</NavLink>
          <NavLink to="/users" onClick={() => setOpen(false)} className="text-slate-300 py-2">Users</NavLink>

          <div className="mt-2 pt-4 border-t border-slate-800 flex flex-col gap-3">
            <div className="text-xs text-slate-400">
              Signed in as <strong className="text-slate-300">{username}</strong>
            </div>
            <button onClick={handleLogout} className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium px-4 py-2 rounded-md transition text-center">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;