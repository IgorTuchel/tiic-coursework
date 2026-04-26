import { useEffect } from "react";
import { LuX, LuArrowLeft } from "react-icons/lu";

export function Modal({
  title,
  subtitle,
  onClose,
  onBack,
  children,
  footer,
  maxWidth = "max-w-md",
}) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className={`w-full ${maxWidth} rounded-xl bg-slate-800 border border-slate-700 shadow-xl`}>
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2 min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className="text-slate-400 hover:text-white transition-colors shrink-0 -ml-1"
                aria-label="Go back">
                <LuArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-100">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors mt-0.5 ml-4 shrink-0">
            <LuX className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-slate-700">{footer}</div>
        )}
      </div>
    </div>
  );
}
