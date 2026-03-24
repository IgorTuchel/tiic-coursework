import Header from "../components/Header";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;