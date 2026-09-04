const steps = [
  {
    number: "1",
    title: "Upload",
    description: "Drop in a PDF, DOCX, image or CSV.",
  },
  {
    number: "2",
    title: "Detect",
    description: "PII Redactor automatically identifies sensitive information.",
  },
  {
    number: "3",
    title: "Redact",
    description: "Review and permanently remove sensitive information.",
  },
  {
    number: "4",
    title: "Export",
    description: "Download a clean, shareable document.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-slate-200 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-slate-600">
            Removing PII manually is slow, inconsistent and difficult to audit.
            PII Redactor turns it into a single automated step.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative rounded-2xl border border-slate-200 p-6">
              <span className="text-4xl font-bold text-indigo-100">{step.number}</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
