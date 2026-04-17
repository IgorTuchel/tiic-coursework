import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast"; 

const INITIAL_TOOLS = [
  { id: 1, name: "Torque Wrench", required: true, scanned: false },
  { id: 2, name: "Voltage Tester", required: true, scanned: false },
  { id: 3, name: "Inspection Camera", required: false, scanned: false },
];

function ToolScanner() {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [tools, setTools] = useState(INITIAL_TOOLS);
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const streamRef = useRef(null);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", focusMode: "continuous" },
          audio: false,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const [track] = stream.getVideoTracks();
        const capabilities = track.getCapabilities();
        if (capabilities.focusMode) {
          track.applyConstraints({ advanced: [{ focusMode: "continuous" }] });
        }
      } catch (err) {
        console.error(err);
        setError("Unable to access camera.");
      }
    }
    enableCamera();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startToolScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTools((prevTools) =>
            prevTools.map((t) => (t.required ? { ...t, scanned: true } : t))
          );
          setIsScanning(false);
          // Trigger the global success toast
          toast.success("Required tools successfully verified!");
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requiredCount = tools.filter((t) => t.required).length;
  const scannedRequired = tools.filter((t) => t.required && t.scanned).length;

  return (
    <div className="tool-scanner flex flex-col items-center gap-4 w-full">
      <h3 className="text-lg font-semibold text-slate-100">Tool Check</h3>
      {error && <p className="text-rose-500 text-sm">{error}</p>}

      {/* Responsive video wrapper */}
      <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden border border-slate-700 bg-slate-800">
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className="w-full h-full object-cover"
        />

        {/* Red box snaps to edges using inset-0 */}
        <div className="absolute inset-0 border-2 sm:border-4 border-red-500/80 pointer-events-none rounded-md" />
      </div>

      <p className="text-sm text-slate-400 mt-1 text-center px-2">
        Place your tools in view inside the red box, then start the scan.
      </p>

      <button
        onClick={startToolScan}
        disabled={isScanning}
        className={`w-full max-w-xs px-4 py-2.5 rounded-md text-white font-medium transition-colors ${
          isScanning ? "bg-slate-700 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-500"
        }`}
      >
        {isScanning ? `Scanning... ${countdown}` : "Start tool scan"}
      </button>

      <div className="tool-summary text-sm mt-2">
        <span className="text-slate-300">Required tools scanned: </span>
        <strong className={scannedRequired === requiredCount ? "text-emerald-400" : "text-amber-400"}>
          {scannedRequired} / {requiredCount}
        </strong>
      </div>

      <ul className="tool-checklist w-full max-w-md mt-2 space-y-2 text-sm">
        {tools.map((tool) => (
          <li key={tool.id} className="flex justify-between items-center p-3 border border-slate-700 bg-slate-800 rounded-lg">
            <div>
              <strong className="text-slate-200">{tool.name}</strong>{" "}
              {tool.required && <span className="text-xs text-amber-500/80 font-medium ml-1">(required)</span>}
            </div>
            <div className={tool.scanned ? "text-emerald-400 font-medium" : "text-slate-500"}>
              {tool.scanned ? "✓ Scanned" : "Not scanned"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToolScanner;