const codeSample = `POST /v1/redact

{
  "document": "candidate_cv.pdf",
  "categories": ["name", "email", "phone", "passport"],
  "redaction": { "style": "block" }
}`;

const responseSample = `{
  "status": "completed",
  "entities_found": 17,
  "entities_redacted": 17,
  "document_url": "https://api.piiredactor.com/files/...",
  "expires_at": "2026-09-05T04:00:00Z"
}`;

export default function ApiSection() {
  return (
    <section id="api" className="border-b border-slate-200 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            For developers
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            PII redaction for your applications.
          </h2>
          <p className="mt-4 text-slate-600">
            Don&apos;t manually upload documents. Send them directly to our API
            and receive a sanitized version automatically.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-6 text-xs leading-relaxed text-slate-200 sm:text-sm">
            <code>{codeSample}</code>
          </pre>
          <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-6 text-xs leading-relaxed text-emerald-300 sm:text-sm">
            <code>{responseSample}</code>
          </pre>
        </div>
        <div className="mt-8 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
          <p>
            <strong className="text-slate-900">Input:</strong> document, PII
            categories, redaction configuration
          </p>
          <p>
            <strong className="text-slate-900">Output:</strong> redacted
            document, detected entities, confidence scores
          </p>
          <p>
            <strong className="text-slate-900">Integrate</strong> directly into
            recruitment, legal, finance or AI ingestion workflows
          </p>
        </div>
      </div>
    </section>
  );
}
