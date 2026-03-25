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
    <div className="ar-scanner flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">AR Scanner</h3>
      {error && <p className="text-red-500">{error}</p>}

      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className="w-full rounded-md border border-slate-700 bg-black"
        />

        {/* Red box overlay for marker scanning */}
        <div className="absolute top-1/2 left-1/2 w-88 h-52 -translate-x-1/2 -translate-y-1/2 border-4 border-red-500 pointer-events-none rounded-md" />
      </div>

      <p className="text-sm text-slate-400 text-center mt-1">
        Point the camera at a marker. Click the marker below to select it.
      </p>

      <div className="flex gap-2 mt-2">
        {markers.map((marker) => (
          <button
            key={marker.id}
            onClick={() => handleMarkerClick(marker)}
            className={`px-3 py-1 rounded-md text-sm font-medium border ${
              selectedMarkerId === marker.id
                ? "bg-red-500 text-white border-red-500"
                : "bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600"
            }`}
          >
            {marker.name}
          </button>
        ))}
      </div>

      {selectedMarkerId && (
        <div className="mt-2 text-sm">
          Selected Marker: <strong>#{selectedMarkerId}</strong>
        </div>
      )}
    </div>
  );
}

export default ArScanner;