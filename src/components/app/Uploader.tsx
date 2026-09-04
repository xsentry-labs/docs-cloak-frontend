"use client";

import { useCallback, useRef, useState } from "react";
import { SAMPLE_DOCUMENT } from "@/lib/pii";

const ACCEPTED = [".pdf", ".docx", ".txt", ".png", ".jpg", ".jpeg", ".csv"];
const TEXT_EXTENSIONS = [".txt", ".csv"];
// Mirrors the backend's default MAX_UPLOAD_BYTES (see docs-cloak's app/config.py) so
// oversized files are rejected instantly client-side instead of uploading first and
// failing only once the backend rejects them.
const MAX_FILE_SIZE_BYTES = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_BYTES ?? 25 * 1024 * 1024);

function formatMb(bytes: number): string {
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10}MB`;
}

export interface UploadedFile {
  name: string;
  file: File;
  /** Plain text of the upload, available client-side only for TXT/CSV — used for the review preview. */
  textPreview?: string;
}

interface Props {
  onFileReady: (file: UploadedFile) => void;
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
      if (file.size === 0) {
        setError("This file is empty.");
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(
          `That file is ${formatMb(file.size)}, which is over the ${formatMb(MAX_FILE_SIZE_BYTES)} limit.`
        );
        return;
      }
      setError(null);

      const textPreview = TEXT_EXTENSIONS.includes(ext) ? await file.text() : undefined;
      onFileReady({ name: file.name, file, textPreview });
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
          data-testid="file-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />
      </div>
      {error && (
        <p data-testid="upload-error" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
      <button
        type="button"
        data-testid="try-sample"
        onClick={() => {
          const file = new File([SAMPLE_DOCUMENT], "sample_candidate_cv.txt", { type: "text/plain" });
          onFileReady({ name: file.name, file, textPreview: SAMPLE_DOCUMENT });
        }}
        className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
      >
        Or try it with a sample document →
      </button>
    </div>
  );
}
