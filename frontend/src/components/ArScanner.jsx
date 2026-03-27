import React, { useRef, useState, useEffect } from "react";

function ArScanner({ selectedMarkerId, onMarkerChange }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [markers, setMarkers] = useState([
    { id: 1, name: "Marker 1" },
    { id: 2, name: "Marker 2" },
    { id: 3, name: "Marker 3" },
  ]);

  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", focusMode: "continuous" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error(err);
        setError("Unable to access camera.");
      }
    }
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleMarkerClick = (marker) => {
    onMarkerChange(marker.id);
  };

  return (
    <div className="ar-scanner flex flex-col items-center gap-4 w-full">
      <h3 className="text-lg font-semibold">AR Scanner</h3>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* NEW: Responsive video wrapper */}
      <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden border border-slate-700 bg-black">
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className="w-full h-full object-cover"
        />

        {/* NEW: Responsive Red box overlay */}
        <div className="absolute top-1/2 left-1/2 w-[70%] h-[60%] -translate-x-1/2 -translate-y-1/2 border-2 sm:border-4 border-red-500/80 pointer-events-none rounded-md shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
      </div>

      <p className="text-sm text-slate-400 text-center mt-1 px-2">
        Point the camera at a marker. Click the marker below to select it.
      </p>

      <div className="flex flex-wrap justify-center gap-2 mt-2 w-full">
        {markers.map((marker) => (
          <button
            key={marker.id}
            onClick={() => handleMarkerClick(marker)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
              selectedMarkerId === marker.id
                ? "bg-red-500 text-white border-red-500"
                : "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700"
            }`}
          >
            {marker.name}
          </button>
        ))}
      </div>

      {selectedMarkerId && (
        <div className="mt-2 text-sm text-slate-300">
          Selected Marker: <strong className="text-sky-400">#{selectedMarkerId}</strong>
        </div>
      )}
    </div>
  );
}

export default ArScanner;