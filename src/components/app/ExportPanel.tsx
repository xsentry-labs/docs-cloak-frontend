"use client";

import { useEffect, useState } from "react";
import { redactDocument } from "@/lib/api";
import { DetectedEntity, PiiCategory } from "@/lib/pii";

interface Props {
  file: File;
  categories: PiiCategory[];
  entities: DetectedEntity[];
  onBack: () => void;
  onRestart: () => void;
}

interface FinalResult {
  documentUrl: string;
  redactedCount: number;
}

export default function ExportPanel({ file, categories, entities, onBack, onRestart }: Props) {
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FinalResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function finalize() {
      setStatus("loading");
      setError(null);
      try {
        const excludeEntityIds = entities
          .filter((e) => !e.accepted && !e.manual)
          .map((e) => e.id);
        const manualRedactionTexts = entities
          .filter((e) => e.accepted && e.manual)
          .map((e) => e.value);

        const res = await redactDocument(file, {
          categories,
          excludeEntityIds,
          manualRedactionTexts,
        });

        if (cancelled) return;
        setResult({
          documentUrl: res.documentUrl,
          redactedCount: res.entities.filter((e) => e.accepted).length,
        });
        setStatus("done");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong while exporting.");
        setStatus("error");
      }
    }

    finalize();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
        <p className="mt-4 text-sm text-slate-500">Applying your redactions…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
          ✕
        </span>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Export failed</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{error}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Back to review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
        ✓
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">Document ready</h2>
      <p className="mt-1 text-sm text-slate-500">
        {result?.redactedCount} entities redacted from {file.name}. The original file is not
        included in the export, and the download link expires automatically.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={result?.documentUrl}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Download redacted document
        </a>
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
