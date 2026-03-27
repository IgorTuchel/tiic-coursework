import Header from "../components/Header";

function MainLayout({ children }) {
  return (
    // Locks the page from scrolling sideways
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full overflow-x-hidden">
      <Header />
      {/*p-4 on mobile so it doesn't waste space, flex-1 pushes footer down if you add one */}
      <main className="p-4 sm:p-6 w-full max-w-6xl mx-auto space-y-6 flex-1">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;