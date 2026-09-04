"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_LABEL,
  DetectedEntity,
  PII_CATEGORIES,
  PiiCategory,
  redactedPreview,
} from "@/lib/pii";

interface Props {
  /** Plain text of the upload, only available for TXT/CSV files — enables the live block preview. */
  textPreview?: string;
  entities: DetectedEntity[];
  onChange: (entities: DetectedEntity[]) => void;
  onBack: () => void;
  onExport: () => void;
}

export default function ReviewPanel({ textPreview, entities, onChange, onBack, onExport }: Props) {
  const [manualValue, setManualValue] = useState("");
  const [manualCategory, setManualCategory] = useState<PiiCategory>("NAME");

  const preview = useMemo(
    () => (textPreview !== undefined ? redactedPreview(textPreview, entities) : null),
    [textPreview, entities]
  );
  const acceptedCount = entities.filter((e) => e.accepted).length;

  function toggleAccepted(id: string) {
    onChange(entities.map((e) => (e.id === id ? { ...e, accepted: !e.accepted } : e)));
  }

  function removeEntity(id: string) {
    onChange(entities.filter((e) => e.id !== id));
  }

  function changeCategory(id: string, category: PiiCategory) {
    onChange(entities.map((e) => (e.id === id ? { ...e, category } : e)));
  }

  function addManual() {
    const value = manualValue.trim();
    if (!value) return;
    const start = textPreview?.indexOf(value) ?? -1;
    onChange([
      ...entities,
      {
        id: `manual-${Date.now()}`,
        category: manualCategory,
        value,
        start: start === -1 ? 0 : start,
        end: start === -1 ? 0 : start + value.length,
        confidence: 1,
        accepted: true,
        manual: true,
      },
    ]);
    setManualValue("");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Review detected entities</h2>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {acceptedCount} of {entities.length} will be redacted
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Detected entities
          </p>
          <div data-testid="entity-list" className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {entities.length === 0 && (
              <p data-testid="no-entities-message" className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                No entities detected for the selected categories.
              </p>
            )}
            {entities.map((entity) => (
              <div
                key={entity.id}
                data-testid="entity-row"
                className={`rounded-lg border p-3 ${
                  entity.accepted ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <label className="flex flex-1 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={entity.accepted}
                      onChange={() => toggleAccepted(entity.id)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    <span className="truncate font-mono text-slate-800">{entity.value}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeEntity(entity.id)}
                    className="text-xs font-medium text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2 pl-6">
                  <select
                    value={entity.category}
                    onChange={(e) => changeCategory(entity.id, e.target.value as PiiCategory)}
                    className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                  >
                    {PII_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-slate-400">
                    {Math.round(entity.confidence * 100)}% confidence
                    {entity.manual ? " · manual" : entity.source ? ` · ${entity.source}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Add manual redaction
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                type="text"
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                placeholder="Exact text to redact"
                className="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
              <select
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value as PiiCategory)}
                className="rounded border border-slate-300 px-2 py-1.5 text-sm"
              >
                {PII_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addManual}
                className="rounded bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Redacted preview
          </p>
          {preview !== null ? (
            <pre className="h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800">
              {preview}
            </pre>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
              A text preview isn&apos;t available for this file type — the backend redacts the
              real PDF/DOCX/image directly. Download it on the next step to see the result.
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800">
          ← Back
        </button>
        <button
          type="button"
          data-testid="continue-to-export"
          onClick={onExport}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Continue to export
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Categories shown: {Array.from(new Set(entities.map((e) => CATEGORY_LABEL[e.category] ?? e.category))).join(", ") || "—"}
      </p>
    </div>
  );
}
