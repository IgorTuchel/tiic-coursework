import React, { useEffect, useRef, useState } from "react";

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

  // Store the media stream to control focus later
  const streamRef = useRef(null);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "environment",
            focusMode: "continuous" // Attempt focus mode
          },
          audio: false,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Try to set focus manually if supported
        const [track] = stream.getVideoTracks();
        const capabilities = track.getCapabilities();
        if (capabilities.focusMode) {
          track.applyConstraints({ advanced: [{ focusMode: "continuous" }] });
        }
      } catch (err) {
        console.error(err);
        setError("Unable to access camera or focus mode not supported.");
      }
    }

    enableCamera();

    return () => {
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
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

          // Simulate scanning all required tools
          setTools((prevTools) =>
            prevTools.map((t) =>
              t.required ? { ...t, scanned: true } : t
            )
          );

          setIsScanning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requiredCount = tools.filter((t) => t.required).length;
  const scannedRequired = tools.filter((t) => t.required && t.scanned).length;

  return (
    <div className="tool-scanner flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Tool Check</h3>
      {error && <p className="text-red-500">{error}</p>}

      <div className="relative w-full max-w-md">
        {/* Video feed */}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className="w-full rounded-md border border-slate-700 bg-black"
        />

        {/* Red focus box overlay */}
        <div className="absolute top-1/2 left-1/2 w-88 h-52 -translate-x-1/2 -translate-y-1/2 border-4 border-red-500 pointer-events-none rounded-md" />
      </div>

      <p className="text-sm text-slate-400 mt-1 text-center">
        Place your tools in view inside the red box, then start the scan.
      </p>

      <button
        onClick={startToolScan}
        disabled={isScanning}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          isScanning ? "bg-slate-700 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"
        }`}
      >
        {isScanning ? `Scanning... ${countdown}` : "Start tool scan"}
      </button>

      <div className="tool-summary text-sm">
        <strong>
          Required tools scanned: {scannedRequired} / {requiredCount}
        </strong>
      </div>

      <ul className="tool-checklist w-full max-w-md mt-2 space-y-1 text-sm">
        {tools.map((tool) => (
          <li key={tool.id} className="flex justify-between p-2 border border-slate-700 rounded-md">
            <div>
              <strong>{tool.name}</strong>{" "}
              {tool.required && <span className="text-xs text-amber-400">(required)</span>}
            </div>
            <div>Status: {tool.scanned ? "Scanned" : "Not scanned"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToolScanner;