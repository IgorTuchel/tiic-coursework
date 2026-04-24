import { LuX } from "react-icons/lu";
import ARPolygonApp from "./ar/ARPolygonApp";
import AIToolChecker from "./ar/AIToolChecker";

function Loader({ label, textColor = "text-slate-400" }) {
  return (
    <div
      className={`flex items-center justify-center h-full text-sm ${textColor}`}>
      {label}
    </div>
  );
}

export function AIView({ modelFiles, report, onComplete, onExit }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950">
      {modelFiles ? (
        <AIToolChecker
          modelFiles={modelFiles}
          requiredTools={report.toolChecks}
          onComplete={onComplete}
          onCancel={onExit}
        />
      ) : (
        <Loader label="Loading AI model…" />
      )}
    </div>
  );
}

export function ARView({
  markerUrl,
  report,
  initialPolygonData,
  onSave,
  onExit,
}) {
  return (
    <div className="fixed inset-0 z-50">
      {markerUrl ? (
        <ARPolygonApp
          markerName={report.name}
          markerDetails={{ description: report.description }}
          markerUrl={markerUrl}
          initialData={initialPolygonData}
          onSave={onSave}
          onExit={onExit}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-black text-white text-sm">
          Loading marker…
        </div>
      )}
    </div>
  );
}
