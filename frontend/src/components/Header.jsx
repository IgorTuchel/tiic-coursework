import { Link } from "react-router-dom";
import logo from "../assets/hero.png";

function Header() {
  const username = localStorage.getItem("username");

  return (
    <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="AR Inspectra Logo"
          className="h-8 w-8 object-contain"
        />

        <div>
          <div className="text-xs font-semibold tracking-widest text-sky-400">
            AR
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-semibold">Inspectra</h1>
            <span className="text-xs text-slate-500">
              Maintenance Console
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-slate-400">
          Signed in as {username?.split("@")[0] || "Guest"}
        </span>

        <Link
          to="/"
          onClick={() => localStorage.removeItem("username")}
          className="rounded-md border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800"
        >
          Sign out
        </Link>
      </div>
    </header>
  );
}

export default Header;