import Header from "../components/Header";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full overflow-x-hidden">
      
      {/* Invisible skip link for Screen Reader users */}
      <a
        href="#main-content"
        className="absolute -top-full left-4 z-[999] bg-sky-600 text-white px-4 py-2 rounded-md font-medium transition-all focus:top-4 focus:outline-none focus:ring-4 focus:ring-sky-500/50"
      >
        Skip to main content
      </a>

      <Header />
      
      {/* id="main-content" so the skip link knows where to jump */}
      <main id="main-content" className="p-4 sm:p-6 w-full max-w-6xl mx-auto space-y-6 flex-1 focus:outline-none" tabIndex="-1">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;