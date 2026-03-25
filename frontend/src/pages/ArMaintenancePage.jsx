import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ArScanner from "../components/ArScanner";
import FaultForm from "../components/FaultForm";
import FaultList from "../components/FaultList";

function ArMaintenancePage() {
  const [markerId, setMarkerId] = useState(null);
  const [faults, setFaults] = useState([]);

  const handleFaultCreated = (fault) => {
    setFaults((prev) => [...prev, fault]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">AR Maintenance</h2>
        <p className="text-sm text-slate-400">Scan environment and attach faults to AR markers.</p>

        <ArScanner selectedMarkerId={markerId} onMarkerChange={setMarkerId} />

        <div className="space-y-4">
          <FaultForm markerId={markerId} onCreated={handleFaultCreated} />
          <FaultList faults={faults} />
        </div>
      </div>
    </MainLayout>
  );
}

export default ArMaintenancePage;