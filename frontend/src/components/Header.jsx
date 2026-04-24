// src/components/Header.jsx
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../lib/api";
import {
  LuLayers,
  LuSettings,
  LuLogOut,
  LuMenu,
  LuX,
  LuType,
} from "react-icons/lu";
import toast from "react-hot-toast";

function Header() {
  const { user, setIsAuthenticated, setUser } = useContext(AuthContext);
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const displayName = `${firstName} ${lastName}`.trim() || "Unknown User";
  const email = user?.email;
  const perms = user?.roleInfo;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [textSizeLevel, setTextSizeLevel] = useState(0);

  const profileRef = useRef(null);
  const mobileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-lg", "text-xl");
    if (textSizeLevel === 1) root.classList.add("text-lg");
    if (textSizeLevel === 2) root.classList.add("text-xl");
  }, [textSizeLevel]);

  const handleLogout = async () => {
    try {
      const res = await api.post("/logout");
      if (!res.data.success) {
        toast.error(res.data.message || "Logout failed. Please try again.");
        return;
      }
      toast.success("Logged out successfully.");
    } catch (err_) {
      toast.error(
        err_.response?.data?.message ||
          err_.message ||
          "An error occurred during logout.",
      );
      return;
    }
    setIsAuthenticated(false);
    setUser(null);
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const textSizeLabel = ["Standard", "Large", "X-Large"][textSizeLevel];

  const initials =
    [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() ||
    email[0]?.toUpperCase() ||
    "?";

  const navLinks = [
    { to: "/app/dashboard", label: "Dashboard" },
    { to: "/app/maintenance", label: "Maintenance Reports" },
    ...(perms?.canWorkOnReports ||
    perms?.canViewAllReports ||
    perms?.canSuggestFaults ||
    perms?.canManageFaults ||
    perms?.canViewAllFaults
      ? [{ to: "/app/faults", label: "Fault Reports" }]
      : []),
    ...(perms?.canManageUsers || perms?.canViewAllUsers
      ? [{ to: "/app/admin", label: "Users" }]
      : []),
    ...(perms?.canViewSecurityLogs || perms?.canViewActivityLogs
      ? [{ to: "/app/logs", label: "Logs" }]
      : []),
  ];

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-white font-medium border-b-2 border-sky-500 pb-1"
      : "text-slate-400 hover:text-white pb-1 transition-colors";

  const dropdownCard =
    "absolute right-0 mt-2 rounded-lg bg-slate-800 border border-slate-700 shadow-lg shadow-black/40 z-50 overflow-hidden";

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          to="/app/dashboard"
          className="flex items-center gap-2.5 group shrink-0">
          <LuLayers className="w-5 h-5 text-sky-500 group-hover:text-sky-400 transition-colors" />
          <span className="text-base font-semibold tracking-wide uppercase text-slate-100 group-hover:text-white transition-colors">
            Inspectra
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden sm:flex items-center gap-5 text-sm flex-1"
          aria-label="Main">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          {/* Desktop profile dropdown */}
          <div className="hidden sm:block relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              aria-label="Profile menu"
              aria-expanded={profileOpen}
              className="w-8 h-8 rounded-full bg-sky-700 hover:bg-sky-600 flex items-center justify-center text-xs font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900">
              {initials}
            </button>

            {profileOpen && (
              <div className={`${dropdownCard} w-60`}>
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-medium text-slate-100 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {email}
                  </p>
                  <span className="inline-block mt-1.5 text-xs text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full">
                    {user?.role}
                  </span>
                </div>

                <div className="py-1 text-sm">
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                    <LuSettings className="w-4 h-4 shrink-0" />
                    Settings
                  </Link>
                  <button
                    onClick={() => setTextSizeLevel((p) => (p + 1) % 3)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                    <LuType className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">Text size</span>
                    <span className="text-xs text-sky-400">
                      {textSizeLabel}
                    </span>
                  </button>
                </div>

                <div className="border-t border-slate-700 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">
                    <LuLogOut className="w-4 h-4 shrink-0" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger + floating menu */}
          <div className="sm:hidden relative" ref={mobileRef}>
            <button
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="w-9 h-9 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500">
              {mobileOpen ? (
                <LuX className="w-5 h-5" />
              ) : (
                <LuMenu className="w-5 h-5" />
              )}
            </button>

            {mobileOpen && (
              <div className={`${dropdownCard} w-72`}>
                {/* User strip */}
                <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{email}</p>
                  </div>
                  <span className="ml-auto text-xs text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full shrink-0">
                    {user?.role}
                  </span>
                </div>

                {/* Nav links */}
                <nav className="py-1 text-sm" aria-label="Mobile">
                  {navLinks.map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2.5 transition-colors ${
                          isActive
                            ? "text-white bg-slate-700 font-medium"
                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                        }`
                      }>
                      {label}
                    </NavLink>
                  ))}
                </nav>

                {/* Actions */}
                <div className="border-t border-slate-700 py-1 text-sm">
                  <button
                    onClick={() => setTextSizeLevel((p) => (p + 1) % 3)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                    <LuType className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">Text size</span>
                    <span className="text-xs text-sky-400">
                      {textSizeLabel}
                    </span>
                  </button>
                  <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                    <LuSettings className="w-4 h-4 shrink-0" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-slate-700 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">
                    <LuLogOut className="w-4 h-4 shrink-0" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
