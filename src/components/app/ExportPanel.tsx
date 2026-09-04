"use client";

import { FormEvent, useState } from "react";
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
  originalDocumentUrl: string | null;
  redactedCount: number;
}

const MIN_PASSWORD_LENGTH = 8;

export default function ExportPanel({ file, categories, entities, onBack, onRestart }: Props) {
  const [status, setStatus] = useState<"options" | "loading" | "done" | "error">("options");
  const [loadingLabel, setLoadingLabel] = useState("Applying your redactions…");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FinalResult | null>(null);

  const [protectOriginal, setProtectOriginal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (protectOriginal) {
      if (password.length < MIN_PASSWORD_LENGTH) {
        setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError("Passwords don't match.");
        return;
      }
    }
    setPasswordError(null);
    setStatus("loading");
    setLoadingLabel("Queued…");
    setError(null);

    try {
      const excludeEntityIds = entities.filter((e) => !e.accepted && !e.manual).map((e) => e.id);
      const manualRedactionTexts = entities
        .filter((e) => e.accepted && e.manual)
        .map((e) => e.value);

      const res = await redactDocument(file, {
        categories,
        excludeEntityIds,
        manualRedactionTexts,
        originalPassword: protectOriginal ? password : undefined,
        onStatus: (s) =>
          setLoadingLabel(s === "queued" ? "Queued…" : "Applying your redactions…"),
      });

      setResult({
        documentUrl: res.documentUrl,
        originalDocumentUrl: res.originalDocumentUrl,
        redactedCount: res.entities.filter((e) => e.accepted).length,
      });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while exporting.");
      setStatus("error");
    }
  }

  if (status === "options") {
    return (
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold text-slate-900">Ready to export</h2>
        <p className="mt-1 text-sm text-slate-500">
          We&apos;ll generate the redacted version of {file.name} using your choices from the
          review step.
        </p>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 hover:border-slate-300">
          <input
            type="checkbox"
            checked={protectOriginal}
            onChange={(e) => setProtectOriginal(e.target.checked)}
            className="mt-1 h-4 w-4 accent-indigo-600"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Also give me a password-protected copy of the original
            </span>
            <span className="block text-xs text-slate-500">
              Keep the unredacted original locked behind a password for your own records, while
              only sharing the redacted copy externally. PDFs get native PDF password protection;
              other file types are delivered as an AES-encrypted zip.
            </span>
          </span>
        </label>

        {protectOriginal && (
          <div className="mt-4 grid gap-3 rounded-xl border border-dashed border-slate-300 p-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={MIN_PASSWORD_LENGTH}
                required={protectOriginal}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={MIN_PASSWORD_LENGTH}
                required={protectOriginal}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            {passwordError && (
              <p className="sm:col-span-2 text-xs font-medium text-red-600">{passwordError}</p>
            )}
            <p className="sm:col-span-2 text-xs text-slate-400">
              We never store this password — it&apos;s used once to encrypt the file and then
              discarded.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button type="button" onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800">
            ← Back
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Generate export
          </button>
        </div>
      </form>
    );
  }

  if (status === "loading") {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
        <p className="mt-4 text-sm text-slate-500">{loadingLabel}</p>
        <p className="mt-1 text-xs text-slate-400">Large PDFs and scanned images can take a bit longer.</p>
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
            onClick={() => setStatus("options")}
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Back
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
        {result?.redactedCount} entities redacted from {file.name}. Download links expire
        automatically.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={result?.documentUrl}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Download redacted document
        </a>
        {result?.originalDocumentUrl && (
          <a
            href={result.originalDocumentUrl}
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Download protected original
          </a>
        )}
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
