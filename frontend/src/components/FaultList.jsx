import React from "react";

function FaultList({ faults }) {
  
  // Helper to match the exact dark mode badge colors from the Dashboard
  const getSeverityClasses = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high": 
        return "bg-rose-500/15 text-rose-300 border border-rose-500/20";
      case "medium": 
        return "bg-amber-500/15 text-amber-200 border border-amber-500/20";
      case "low": 
        return "bg-emerald-500/15 text-emerald-200 border border-emerald-500/20";
      default: 
        return "bg-slate-800 text-slate-300 border border-slate-700";
    }
  };

  if (!faults || faults.length === 0) {
    return (
      <div className="w-full mt-4">
        <h3 className="text-lg font-semibold text-slate-100 mb-3 border-b border-slate-800 pb-2">Existing Faults</h3>
        <p className="text-sm text-slate-500 italic text-center py-6 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
          No faults recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      {/* Header section with a count */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
        <h3 className="text-lg font-semibold text-slate-100">Existing Faults</h3>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">{faults.length} recorded</span>
      </div>
      
      {/* Ticket Cards Container */}
      <div className="flex flex-col gap-3">
        {faults.map((fault) => (
          <div key={fault.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors shadow-sm">
            
            {/* Top Row: Title & Status */}
            <div className="flex justify-between items-start mb-2 gap-4">
              <h4 className="text-sm font-semibold text-slate-100 break-words">
                {fault.title || "Untitled Fault"}
              </h4>
              <span className="inline-flex shrink-0 rounded-full bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold">
                {fault.status || "Open"}
              </span>
            </div>
            
            {/* Middle Row: Description */}
            {fault.description && (
              <p className="text-xs text-slate-400 mb-4 leading-relaxed break-words">
                {fault.description}
              </p>
            )}
            
            {/* Bottom Row: Severity & Marker */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800/60 mt-auto">
              <div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getSeverityClasses(fault.severity)}`}>
                  {fault.severity || "Medium"}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                📍 Marker: <strong className="text-sky-400 font-mono">#{fault.markerId || fault.marker || "None"}</strong>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default FaultList;