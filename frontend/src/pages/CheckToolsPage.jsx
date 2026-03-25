import React from "react";
import MainLayout from "../layouts/MainLayout";
import ToolScanner from "../components/ToolScanner";

function CheckToolsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Tool Check</h2>
        <p className="text-sm text-slate-400">
          Scan and verify your tools. Required tools must be detected to pass the checklist.
        </p>
        <ToolScanner />
      </div>
    </MainLayout>
  );
}

export default CheckToolsPage;