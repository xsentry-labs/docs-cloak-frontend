"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import Stepper from "./Stepper";
import Uploader from "./Uploader";
import CategoryPicker from "./CategoryPicker";
import ReviewPanel from "./ReviewPanel";
import ExportPanel from "./ExportPanel";
import { DetectedEntity, PII_CATEGORIES, PiiCategory, detectEntities } from "@/lib/pii";

interface UploadedFile {
  name: string;
  type: string;
  text: string;
  simulated: boolean;
}

const DEFAULT_CATEGORIES = new Set<PiiCategory>(
  PII_CATEGORIES.filter((c) => c.defaultOn).map((c) => c.id)
);

export default function RedactorApp() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [categories, setCategories] = useState<Set<PiiCategory>>(DEFAULT_CATEGORIES);
  const [entities, setEntities] = useState<DetectedEntity[]>([]);
  const [detecting, setDetecting] = useState(false);

  function handleFileReady(f: UploadedFile) {
    setFile(f);
    setStep(1);
  }

  function handleDetect() {
    if (!file) return;
    setDetecting(true);
    setTimeout(() => {
      setEntities(detectEntities(file.text, categories));
      setDetecting(false);
      setStep(2);
    }, 700);
  }

  function handleRestart() {
    setFile(null);
    setEntities([]);
    setCategories(DEFAULT_CATEGORIES);
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
            <CategoryPicker
              selected={categories}
              onChange={setCategories}
              onBack={() => setStep(0)}
              onDetect={handleDetect}
              detecting={detecting}
            />
          )}

          {step === 2 && file && (
            <ReviewPanel
              text={file.text}
              entities={entities}
              onChange={setEntities}
              onBack={() => setStep(1)}
              onExport={() => setStep(3)}
            />
          )}

          {step === 3 && file && (
            <ExportPanel
              fileName={file.name}
              text={file.text}
              entities={entities}
              simulated={file.simulated}
              onBack={() => setStep(2)}
              onRestart={handleRestart}
            />
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          This is an interactive preview. Uploaded files are processed in your
          browser and are never sent to a server.
        </p>
      </main>
    </div>
  );
}
