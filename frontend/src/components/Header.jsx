import { NavLink, Link } from "react-router-dom";
import {
  LuLayers,
  LuSettings,
  LuLogOut,
  LuMenu,
  LuX,
  LuType,
} from "react-icons/lu";
import SettingsModal from "./SettingsModal";
import { useHeader } from "../hooks/useHeader";
import { initials } from "../utils/utils";

function Header() {
  const {
    user,
    setUser,
    navLinks,
    textSizeLevel,
    textSizeLabel,
    mobileOpen,
    setMobileOpen,
    profileOpen,
    setProfileOpen,
    settingsOpen,
    setSettingsOpen,
    profileRef,
    mobileRef,
    applyTextSize,
    handleLogout,
    openSettings,
    handleProfileMouseDown,
    handleProfileFocus,
    handleProfileBlur,
  } = useHeader();

  const displayName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Unknown User";
  const email = user?.email;

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-white font-medium border-b-2 border-sky-500 pb-1"
      : "text-slate-400 hover:text-white pb-1 transition-colors";

  const dropdownCard =
    "absolute right-0 mt-2 rounded-lg bg-slate-800 border border-slate-700 shadow-lg shadow-black/40 z-50 overflow-hidden";

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
          <Link
            to="/app/dashboard"
            className="flex items-center gap-2.5 group shrink-0">
            <LuLayers className="w-5 h-5 text-sky-500 group-hover:text-sky-400 transition-colors" />
            <span className="text-base font-semibold tracking-wide uppercase text-slate-100 group-hover:text-white transition-colors">
              Inspectra
            </span>
          </Link>

          <nav
            className="hidden sm:flex items-center gap-5 text-sm flex-1"
            aria-label="Main">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <div
              className="hidden sm:block relative"
              ref={profileRef}
              onMouseDown={handleProfileMouseDown}
              onFocus={handleProfileFocus}
              onBlur={handleProfileBlur}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className="w-8 h-8 rounded-full bg-sky-700 hover:bg-sky-600 flex items-center justify-center text-xs font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                {initials(user)}
              </button>

              {profileOpen && (
                <div className={`${dropdownCard} w-60`} role="menu">
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
                    <button
                      role="menuitem"
                      onClick={openSettings}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                      <LuSettings className="w-4 h-4 shrink-0" />
                      Settings
                    </button>

                    <button
                      role="menuitem"
                      onClick={() => applyTextSize((textSizeLevel + 1) % 3)}
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
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">
                      <LuLogOut className="w-4 h-4 shrink-0" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                  <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                      {initials(user)}
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

                  <div className="border-t border-slate-700 py-1 text-sm">
                    <button
                      onClick={() => applyTextSize((textSizeLevel + 1) % 3)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                      <LuType className="w-4 h-4 shrink-0" />
                      <span className="flex-1 text-left">Text size</span>
                      <span className="text-xs text-sky-400">
                        {textSizeLabel}
                      </span>
                    </button>

                    <button
                      onClick={openSettings}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                      <LuSettings className="w-4 h-4 shrink-0" />
                      Settings
                    </button>
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

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        setUser={setUser}
      />
    </>
  );
}

export default Header;
