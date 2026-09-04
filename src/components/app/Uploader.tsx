"use client";

import { useCallback, useRef, useState } from "react";
import { SAMPLE_DOCUMENT } from "@/lib/pii";

const ACCEPTED = [".pdf", ".docx", ".txt", ".png", ".jpg", ".jpeg", ".csv"];
const TEXT_EXTENSIONS = [".txt", ".csv"];

interface Props {
  onFileReady: (file: { name: string; type: string; text: string; simulated: boolean }) => void;
}

export default function Uploader({ onFileReady }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ACCEPTED.includes(ext)) {
        setError(`Unsupported file type: ${ext}. Try PDF, DOCX, TXT, PNG, JPG or CSV.`);
        return;
      }
      setError(null);

      if (TEXT_EXTENSIONS.includes(ext)) {
        const text = await file.text();
        onFileReady({ name: file.name, type: ext, text, simulated: false });
      } else {
        onFileReady({ name: file.name, type: ext, text: SAMPLE_DOCUMENT, simulated: true });
      }
    },
    [onFileReady]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) processFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition ${
          dragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
          ⬆
        </span>
        <p className="mt-4 text-base font-semibold text-slate-800">
          Drag & drop a document, or click to browse
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Supports PDF, DOCX, TXT, PNG, JPG, CSV
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />
      </div>
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      <button
        type="button"
        onClick={() =>
          onFileReady({ name: "sample_candidate_cv.txt", type: ".txt", text: SAMPLE_DOCUMENT, simulated: false })
        }
        className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
      >
        Or try it with a sample document →
      </button>
    </div>
  );
}
