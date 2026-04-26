import { useState } from "react";
import { LuCopy, LuCheck, LuX } from "react-icons/lu";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
      title="Copy">
      {copied ? (
        <LuCheck className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <LuCopy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function Block({ label, value }) {
  if (value == null) return null;
  const display =
    typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <CopyButton text={display} />
      </div>
      <pre className="rounded-md bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap break-words">
        {display}
      </pre>
    </div>
  );
}

function Row({ label, value }) {
  if (value == null) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2.5 border-b border-slate-800/60 last:border-0">
      <span className="text-xs text-slate-500 sm:w-36 shrink-0">{label}</span>
      <span className="text-sm text-slate-200 font-mono break-all">
        {String(value)}
      </span>
    </div>
  );
}

export function LogDetailsModal({ log, onClose }) {
  if (!log) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="relative w-full max-w-2xl rounded-xl bg-slate-900 border border-slate-700/50 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Log Details
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {log.method} {log.url}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0">
            <LuX className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5">
          <div className="rounded-md bg-slate-950 border border-slate-800 px-4 divide-y divide-slate-800/60">
            <Row label="Error ID" value={log.errorID} />
            <Row label="Error name" value={log.errorName} />
            <Row label="Status code" value={log.statusCode} />
            <Row label="HTTP status" value={log.httpStatusCode} />
            <Row label="Message" value={log.message} />
            <Row label="Method" value={log.method} />
            <Row label="URL" value={log.url} />
            <Row label="IP address" value={log.ipAddress} />
            <Row label="User agent" value={log.userAgent} />
            <Row label="User ID" value={log.userID} />
            <Row
              label="Timestamp"
              value={
                log.timestamp ? new Date(log.timestamp).toLocaleString() : null
              }
            />
          </div>

          <Block label="Request Body" value={log.body} />
          <Block label="Headers" value={log.headers} />
          <Block label="Stack Trace" value={log.stackTrace} />
        </div>

        <div className="px-5 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
