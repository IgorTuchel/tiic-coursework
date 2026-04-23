import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const MODE_LABELS = {
  scanning: "Move phone slowly to scan the area",
  scanningQR: "Point camera at the target QR Code",
  readyToLock: "Aim the white ring at the QR center and Lock",
  placing: "Tap physical space to add a corner",
  hovering: "Tap the orange point to move it",
  editing: "Move phone to reposition point",
};

const glassPanel =
  "backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl";
const glassButtonBase =
  "flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 active:scale-[0.97]";

export function AROverlay({
  overlayRef,
  hookAPI,
  hasData,
  markerName,
  markerDetails,
}) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [isHudExpanded, setIsHudExpanded] = useState(false);

  useEffect(() => {
    let timer;
    if (confirmClear) timer = setTimeout(() => setConfirmClear(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmClear]);

  if (!hookAPI.arSessionActive) {
    return (
      <div ref={overlayRef} className="absolute inset-0 pointer-events-none" />
    );
  }

  const onClearClick = () => {
    if (confirmClear) {
      hookAPI.handleClearAll();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      toast("Tap 'Confirm Clear' to wipe canvas", { id: "clear-warning" });
    }
  };

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-50 flex flex-col justify-between pointer-events-none p-4 sm:p-6 font-sans select-none">
      <TopHUD
        {...hookAPI}
        markerName={markerName}
        markerDetails={markerDetails}
        isHudExpanded={isHudExpanded}
        setIsHudExpanded={setIsHudExpanded}
        confirmClear={confirmClear}
        onClearClick={onClearClick}
      />
      <ControlDock {...hookAPI} hasData={hasData} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(20, 20, 20, 0.8)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    </div>
  );
}

function TopHUD({
  blockXRTap,
  unblockXRTap,
  isHudExpanded,
  setIsHudExpanded,
  markerName,
  isMarkerTracked,
  isAnchorLocked,
  markerDetails,
  endAR,
  currentMode,
  confirmClear,
  onClearClick,
}) {
  return (
    <div className="flex justify-between items-start w-full">
      <div
        onPointerDown={blockXRTap}
        onPointerUp={unblockXRTap}
        onClick={() => setIsHudExpanded(!isHudExpanded)}
        className={`pointer-events-auto ${glassPanel} rounded-3xl p-4 flex flex-col cursor-pointer transition-all duration-300 ${isHudExpanded ? "w-64" : "w-48"}`}>
        <div className="flex justify-between items-center w-full">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            Marker: {markerName}
          </span>
          <span
            className="text-white/30 text-xs transform transition-transform duration-300"
            style={{
              transform: isHudExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}>
            ▼
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1.5">
          <div className="relative flex h-3 w-3 items-center justify-center">
            {isMarkerTracked && !isAnchorLocked && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAnchorLocked ? "bg-red-500" : isMarkerTracked ? "bg-emerald-400" : "bg-blue-400"}`}></span>
          </div>
          <span className="text-sm font-bold text-white tracking-wide">
            {isAnchorLocked
              ? "ANCHOR LOCKED"
              : isMarkerTracked
                ? "MARKER FOUND"
                : "SEARCHING..."}
          </span>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${isHudExpanded ? "max-h-40 mt-3 opacity-100" : "max-h-0 mt-0 opacity-0"}`}>
          <div className="pt-3 border-t border-white/10 text-xs text-white/70 flex flex-col gap-2">
            {markerDetails ? (
              Object.entries(markerDetails).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-start gap-4">
                  <span className="capitalize text-white/40">{key}</span>
                  <span className="font-semibold text-right text-white/90">
                    {value}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-white/40 italic text-center py-2">
                No active database records.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 pointer-events-auto">
        <button
          onPointerDown={blockXRTap}
          onPointerUp={unblockXRTap}
          onClick={endAR}
          className={`${glassPanel} w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/80 hover:border-red-500 transition-all active:scale-95`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isAnchorLocked && currentMode !== "editing" && (
          <button
            onPointerDown={blockXRTap}
            onPointerUp={unblockXRTap}
            onClick={onClearClick}
            className={`${glassButtonBase} px-4 py-2.5 text-xs ${confirmClear ? "bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse border border-red-500" : `${glassPanel} text-red-400 hover:bg-red-500/20`}`}>
            {confirmClear ? "Confirm Clear?" : "Clear Canvas"}
          </button>
        )}
      </div>
    </div>
  );
}

function ControlDock({
  currentMode,
  isAnchorLocked,
  isMarkerTracked,
  toggleAnchorLock,
  blockXRTap,
  unblockXRTap,
  handleDeleteVertex,
  hasData,
  handleLoad,
  handleSave,
}) {
  return (
    <div className="w-full max-w-[28rem] mx-auto mb-2 pointer-events-auto flex flex-col gap-3">
      <div className="text-center px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <p className="text-white/90 font-medium text-sm tracking-wide">
          {MODE_LABELS[currentMode] || ""}
        </p>
      </div>

      <div
        className={`${glassPanel} rounded-[2rem] p-4 flex flex-col gap-3 w-full`}>
        {!isAnchorLocked && (
          <button
            onPointerDown={blockXRTap}
            onPointerUp={unblockXRTap}
            onClick={toggleAnchorLock}
            className={`${glassButtonBase} w-full py-4 text-lg ${isMarkerTracked ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/25" : "bg-white/10 text-white/50 border border-white/5"}`}>
            {isMarkerTracked ? "Lock Anchor Position" : "Scan QR to Begin"}
          </button>
        )}

        {isAnchorLocked && currentMode === "editing" && (
          <div className="flex w-full gap-3">
            <button
              onPointerDown={blockXRTap}
              onPointerUp={unblockXRTap}
              onClick={handleDeleteVertex}
              className={`${glassButtonBase} flex-[0.8] py-4 bg-red-500 text-white shadow-lg shadow-red-500/25`}>
              Delete
            </button>
            <div className="flex-[1.2] py-4 rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold text-center pointer-events-none flex items-center justify-center">
              Tap to drop
            </div>
          </div>
        )}

        {isAnchorLocked && currentMode !== "editing" && (
          <div className="flex flex-col gap-3">
            <div className="flex w-full gap-3">
              {hasData && (
                <button
                  onPointerDown={blockXRTap}
                  onPointerUp={unblockXRTap}
                  onClick={handleLoad}
                  className={`${glassButtonBase} flex-1 py-3.5 bg-white/10 text-white border border-white/10 hover:bg-white/20`}>
                  Load DB
                </button>
              )}
              <button
                onPointerDown={blockXRTap}
                onPointerUp={unblockXRTap}
                onClick={() => {
                  if (handleSave()) toast.success("Polygon saved!");
                }}
                className={`${glassButtonBase} flex-[2] py-3.5 bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500`}>
                {hasData ? "Update Database" : "Save New Polygon"}
              </button>
            </div>
            <button
              onPointerDown={blockXRTap}
              onPointerUp={unblockXRTap}
              onClick={toggleAnchorLock}
              className={`${glassButtonBase} w-full py-3 bg-white/5 text-white/70 border border-white/5 hover:bg-white/10 text-sm`}>
              Unlock Origin Anchor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
