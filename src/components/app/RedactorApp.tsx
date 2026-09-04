"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import Stepper from "./Stepper";
import Uploader, { UploadedFile } from "./Uploader";
import CategoryPicker from "./CategoryPicker";
import ReviewPanel from "./ReviewPanel";
import ExportPanel from "./ExportPanel";
import { redactDocument } from "@/lib/api";
import { DetectedEntity, PII_CATEGORIES, PiiCategory } from "@/lib/pii";

const DEFAULT_CATEGORIES = new Set<PiiCategory>(
  PII_CATEGORIES.filter((c) => c.defaultOn).map((c) => c.id)
);

export default function RedactorApp() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [categories, setCategories] = useState<Set<PiiCategory>>(DEFAULT_CATEGORIES);
  const [entities, setEntities] = useState<DetectedEntity[]>([]);
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  function handleFileReady(f: UploadedFile) {
    setFile(f);
    setDetectError(null);
    setStep(1);
  }

  async function handleDetect() {
    if (!file) return;
    setDetecting(true);
    setDetectError(null);
    try {
      const res = await redactDocument(file.file, { categories: Array.from(categories) });
      setEntities(res.entities);
      setStep(2);
    } catch (err) {
      setDetectError(err instanceof Error ? err.message : "Detection failed.");
    } finally {
      setDetecting(false);
    }
  }

  function handleRestart() {
    setFile(null);
    setEntities([]);
    setCategories(DEFAULT_CATEGORIES);
    setDetectError(null);
    setStep(0);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-800">
            Exit to homepage
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <div className="mb-10">
          <Stepper current={step} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {step === 0 && <Uploader onFileReady={handleFileReady} />}

          {step === 1 && file && (
            <div>
              <CategoryPicker
                selected={categories}
                onChange={setCategories}
                onBack={() => setStep(0)}
                onDetect={handleDetect}
                detecting={detecting}
              />
              {detectError && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {detectError}
                </p>
              )}
            </div>
          )}

          {step === 2 && file && (
            <ReviewPanel
              textPreview={file.textPreview}
              entities={entities}
              onChange={setEntities}
              onBack={() => setStep(1)}
              onExport={() => setStep(3)}
            />
          )}

          {step === 3 && file && (
            <ExportPanel
              file={file.file}
              categories={Array.from(categories)}
              entities={entities}
              onBack={() => setStep(2)}
              onRestart={handleRestart}
            />
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Documents are sent to the PII Redactor API for detection and redaction, and
          automatically deleted after the retention window.
        </p>
      </main>
    </div>
  );
}
