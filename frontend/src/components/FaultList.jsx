import React from "react";

function FaultList({ faults }) {
  if (!faults.length) return <p className="text-sm text-slate-400">No faults yet.</p>;

  return (
    <ul className="space-y-2">
      {faults.map((f) => (
        <li key={f.id} className="flex justify-between bg-slate-800 rounded px-2 py-1">
          <span>Marker #{f.marker}: {f.description}</span>
          <span className="text-xs text-emerald-300">{f.status}</span>
        </li>
      ))}
    </ul>
  );
}

export default FaultList;