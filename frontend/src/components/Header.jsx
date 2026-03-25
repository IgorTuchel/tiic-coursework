import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/hero.png";

function Header() {
  const username = localStorage.getItem("username");
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src={logo} className="h-8 w-8" />
          <h1 className="text-lg sm:text-xl font-semibold">Inspectra</h1>
        </Link>

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-white text-2xl"
        >
          ☰
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <NavLink to="/dashboard" className={({ isActive }) =>
            isActive ? "text-white font-semibold" : "text-slate-400 hover:text-white"
          }>
            Dashboard
          </NavLink>

          <NavLink to="/ar" className={({ isActive }) =>
            isActive ? "text-white font-semibold" : "text-slate-400 hover:text-white"
          }>
            AR Scanner
          </NavLink>

          <NavLink to="/check-tools" className={({ isActive }) =>
            isActive ? "text-white font-semibold" : "text-slate-400 hover:text-white"
          }>
            Tool Check
          </NavLink>

          <NavLink to="/users" className={({ isActive }) =>
            isActive ? "text-white font-semibold" : "text-slate-400 hover:text-white"
          }>
            Users
          </NavLink>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 text-sm border-t border-slate-800">
          <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
          <NavLink to="/ar" onClick={() => setOpen(false)}>AR Scanner</NavLink>
          <NavLink to="/check-tools" onClick={() => setOpen(false)}>Tool Check</NavLink>
          <NavLink to="/users" onClick={() => setOpen(false)}>Users</NavLink>

          <div className="pt-2 border-t border-slate-700 text-xs text-slate-400">
            Signed in as {username?.split("@")[0] || "Guest"}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;