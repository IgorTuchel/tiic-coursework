import React, { useRef } from "react";
import { LuArrowLeft, LuScanLine } from "react-icons/lu";
import { useAR } from "../../../hooks/useAR";
import { AROverlay } from "./AROverlay";
import MainLayout from "../../../layouts/MainLayout";

export default function ARPolygonApp({
  initialData,
  onSave,
  markerName,
  markerDetails,
  markerUrl,
  onExit,
}) {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  const hookAPI = useAR(mountRef, overlayRef, initialData, onSave, markerUrl);

  return (
    <>
      <div
        ref={mountRef}
        className={hookAPI.arSessionActive ? "fixed inset-0 z-0" : "hidden"}
      />
      <div
        ref={overlayRef}
        className={
          hookAPI.arSessionActive
            ? "fixed inset-0 z-10 pointer-events-none"
            : "hidden"
        }>
        {hookAPI.arSessionActive && (
          <AROverlay
            overlayRef={overlayRef}
            hookAPI={hookAPI}
            hasData={!!initialData && initialData.length > 0}
            markerName={markerName}
            markerDetails={markerDetails}
          />
        )}
      </div>

      {!hookAPI.arSessionActive && (
        <MainLayout>
          <div className="flex flex-col h-full px-4 py-6">
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors self-start mb-auto">
              <LuArrowLeft size={15} /> Back
            </button>

            <div className="flex flex-col items-center justify-center flex-1 gap-5 text-center">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-semibold text-slate-100">
                  {markerName || "AR Scanner"}
                </h2>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                  Point your camera at the QR marker, lock the anchor, then tap
                  to place polygon vertices.
                </p>
              </div>

              <button
                onClick={hookAPI.startAR}
                disabled={!markerUrl}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
                <LuScanLine size={16} />
                {markerUrl ? "Launch AR Scanner" : "Loading Marker…"}
              </button>
            </div>
          </div>
        </MainLayout>
      )}
    </>
  );
}
