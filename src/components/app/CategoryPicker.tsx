"use client";

import { PII_CATEGORIES, PiiCategory } from "@/lib/pii";

interface Props {
  selected: Set<PiiCategory>;
  onChange: (next: Set<PiiCategory>) => void;
  onBack: () => void;
  onDetect: () => void;
  /** null when idle; otherwise a short label describing the in-flight detection job. */
  detectingLabel: string | null;
}

export default function CategoryPicker({
  selected,
  onChange,
  onBack,
  onDetect,
  detectingLabel,
}: Props) {
  function toggle(id: PiiCategory) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Choose PII categories to redact</h2>
      <p className="mt-1 text-sm text-slate-500">
        Only the selected categories will be detected and redacted.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PII_CATEGORIES.map((cat) => (
          <label
            key={cat.id}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
              selected.has(cat.id)
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.has(cat.id)}
              onChange={() => toggle(cat.id)}
              className="mt-1 h-4 w-4 accent-indigo-600"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-800">{cat.label}</span>
              <span className="block text-xs text-slate-500">{cat.description}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          ← Back
        </button>
        <button
          type="button"
          data-testid="detect-button"
          onClick={onDetect}
          disabled={selected.size === 0 || detectingLabel !== null}
          className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {detectingLabel ?? "Detect sensitive information"}
        </button>
      </div>
      {detectingLabel && (
        <p className="mt-3 text-right text-xs text-slate-400">
          Large PDFs and scanned images can take a bit longer.
        </p>
      )}
    </div>
  );
}
