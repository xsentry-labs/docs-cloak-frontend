"use client";

import { DetectedEntity, redactedPreview } from "@/lib/pii";

interface Props {
  fileName: string;
  text: string;
  entities: DetectedEntity[];
  simulated: boolean;
  onBack: () => void;
  onRestart: () => void;
}

export default function ExportPanel({ fileName, text, entities, simulated, onBack, onRestart }: Props) {
  const redacted = redactedPreview(text, entities);
  const acceptedCount = entities.filter((e) => e.accepted).length;
  const baseName = fileName.replace(/\.[^/.]+$/, "");

  function download() {
    const blob = new Blob([redacted], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}_redacted.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
        ✓
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">Document ready</h2>
      <p className="mt-1 text-sm text-slate-500">
        {acceptedCount} entities redacted from {fileName}. The original file is
        not included in the export.
      </p>

      {simulated && (
        <p className="mx-auto mt-4 max-w-md rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          Demo mode: this file type is parsed server-side in production. This
          preview redacts a simulated text extraction so you can see the full
          review workflow.
        </p>
      )}

      <div className="mx-auto mt-6 max-w-xl text-left">
        <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800">
          {redacted}
        </pre>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={download}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Download redacted .txt
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Redact another document
        </button>
      </div>
      <button type="button" onClick={onBack} className="mt-4 text-sm font-medium text-slate-500 hover:text-slate-800">
        ← Back to review
      </button>
    </div>
  );
}
