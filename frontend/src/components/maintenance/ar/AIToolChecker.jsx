import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as tmImage from "@teachablemachine/image";
import { LuArrowLeft, LuCamera, LuCheck, LuScanSearch } from "react-icons/lu";
import MainLayout from "../../../layouts/MainLayout";

const DETECTION_THRESHOLD = 0.85;

export default function AIToolChecker({
  modelFiles,
  requiredTools = [],
  onComplete,
  onCancel,
}) {
  const [scannedTools, setScannedTools] = useState(() => new Set());
  const [status, setStatus] = useState("loading");
  const [currentPrediction, setCurrentPrediction] = useState({
    className: "Initializing...",
    probability: 0,
  });

  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);
  const modelRef = useRef(null);
  const requestRef = useRef(null);
  const aliveRef = useRef(false);

  const totalTools = requiredTools.length;
  const toolsScannedCount = scannedTools.size;
  const progressPercentage =
    totalTools > 0 ? Math.round((toolsScannedCount / totalTools) * 100) : 0;
  const allChecked = totalTools > 0 && toolsScannedCount === totalTools;

  const shutdownCamera = useCallback(() => {
    aliveRef.current = false;

    if (requestRef.current) {
      window.cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    const webcam = webcamRef.current;
    if (webcam) {
      try {
        webcam.stop?.();
        const video = webcam.webcam;
        const stream = video?.srcObject;
        if (stream?.getTracks) {
          stream.getTracks().forEach((t) => t.stop());
        }
        if (video) {
          video.srcObject = null;
        }
      } catch (err) {
        console.warn("Camera shutdown error:", err);
      }
      webcamRef.current = null;
    }

    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    if (container && canvas && container.contains(canvas)) {
      container.removeChild(canvas);
    }
    canvasRef.current = null;
    modelRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    shutdownCamera();
    onCancel?.();
  }, [onCancel, shutdownCamera]);

  const handleComplete = useCallback(() => {
    shutdownCamera();
    onComplete?.(Array.from(scannedTools));
  }, [onComplete, scannedTools, shutdownCamera]);

  useEffect(() => {
    if (!modelFiles) return;
    aliveRef.current = true;

    async function initAI() {
      try {
        const model = await tmImage.loadFromFiles(
          modelFiles.model,
          modelFiles.weights,
          modelFiles.metadata,
        );
        if (!aliveRef.current) return;
        modelRef.current = model;

        const webcam = new tmImage.Webcam(320, 320, false);
        webcamRef.current = webcam;

        await webcam.setup({ facingMode: "environment" });
        if (!aliveRef.current) {
          shutdownCamera();
          return;
        }

        await webcam.play();
        if (!aliveRef.current) {
          shutdownCamera();
          return;
        }

        if (canvasContainerRef.current && webcam.canvas) {
          canvasContainerRef.current.appendChild(webcam.canvas);
          canvasRef.current = webcam.canvas;
        }

        setStatus("scanning");

        const loop = async () => {
          if (!aliveRef.current || !webcamRef.current || !modelRef.current)
            return;

          webcamRef.current.update();
          const predictions = await modelRef.current.predict(
            webcamRef.current.canvas,
          );
          if (!aliveRef.current) return;

          const best = predictions.reduce((a, b) =>
            a.probability > b.probability ? a : b,
          );
          setCurrentPrediction(best);

          if (best.probability >= DETECTION_THRESHOLD) {
            const found = requiredTools.find((t) => t.name === best.className);
            if (found) {
              setScannedTools((prev) => {
                const next = new Set(prev);
                next.add(found.name);
                return next;
              });
            }
          }

          requestRef.current = window.requestAnimationFrame(loop);
        };

        requestRef.current = window.requestAnimationFrame(loop);
      } catch (err) {
        console.error("Scanner initialization failed:", err);
        setStatus("error");
      }
    }

    const onUnload = () => shutdownCamera();
    window.addEventListener("beforeunload", onUnload);
    initAI();

    return () => {
      window.removeEventListener("beforeunload", onUnload);
      shutdownCamera();
    };
  }, [modelFiles, requiredTools, shutdownCamera]);

  const predictionLabel = useMemo(() => {
    if (status === "loading") return "Waiting...";
    if (status === "error") return "Scanner unavailable";
    return `${currentPrediction.className} (${Math.round(
      currentPrediction.probability * 100,
    )}%)`;
  }, [status, currentPrediction]);

  return (
    <MainLayout>
      <div className="flex flex-col h-full px-4 py-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors self-start">
          <LuArrowLeft size={15} /> Back
        </button>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-5">
            <div className="space-y-1 text-center">
              <h1 className="text-xl font-semibold text-slate-100">
                Equipment Audit
              </h1>
              <p className="text-sm text-slate-400">
                Scan the required tools to verify the report inventory.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-slate-800 bg-black">
                <div ref={canvasContainerRef} className="absolute inset-0" />

                {status === "loading" && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <span className="text-sm text-slate-400 animate-pulse">
                      Initializing camera and model...
                    </span>
                  </div>
                )}
                {status === "error" && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <span className="text-sm text-red-400">
                      Failed to load scanner.
                    </span>
                  </div>
                )}
                {status === "scanning" && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-20">
                    <LuScanSearch size={40} className="text-white" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Live detection
                </span>
                <span
                  className={`text-sm font-medium transition-colors ${
                    currentPrediction.probability >= DETECTION_THRESHOLD
                      ? "text-emerald-400"
                      : "text-slate-300"
                  }`}>
                  {predictionLabel}
                </span>
              </div>
            </div>

            {/* Tool checlist */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-4">
              <div className="flex items-end justify-between">
                <h2 className="text-sm font-semibold text-slate-200">
                  Required tools
                </h2>
                <span className="text-xs text-slate-500">
                  {toolsScannedCount} of {totalTools} verified
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-sky-600 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="space-y-2">
                {requiredTools.map((tool) => {
                  const isChecked = scannedTools.has(tool.name);
                  return (
                    <div
                      key={tool.name}
                      className={`flex items-center justify-between rounded-lg border px-3.5 py-3 transition-colors ${
                        isChecked
                          ? "border-emerald-500/20 bg-emerald-500/10"
                          : "border-slate-800 bg-slate-950/40"
                      }`}>
                      <div className="flex items-center gap-2">
                        <LuCamera
                          size={15}
                          className={
                            isChecked ? "text-emerald-400" : "text-slate-500"
                          }
                        />
                        <span
                          className={`text-sm font-medium ${
                            isChecked ? "text-emerald-400" : "text-slate-300"
                          }`}>
                          {tool.name}
                        </span>
                      </div>
                      {isChecked ? (
                        <LuCheck size={18} className="text-emerald-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-slate-700" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={!allChecked}
              className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                allChecked
                  ? "bg-sky-600 text-white hover:bg-sky-500"
                  : "cursor-not-allowed bg-slate-800 text-slate-500"
              }`}>
              {allChecked ? "Confirm Tool Check" : "Pending Verification..."}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
