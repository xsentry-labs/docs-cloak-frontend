const categories = [
  "Names",
  "Email addresses",
  "Phone numbers",
  "Physical addresses",
  "Dates of birth",
  "Passport numbers",
  "National ID numbers",
  "Bank account numbers",
  "Credit / debit card numbers",
  "IP addresses",
  "API keys / secrets",
  "Custom sensitive entities",
];

export default function Categories() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Detects the PII that matters
          </h2>
          <p className="mt-4 text-slate-600">
            Choose which categories to redact. Nothing else is touched.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <div
              key={c}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
            >
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
