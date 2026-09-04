const points = [
  "Encryption in transit and at rest",
  "Automatic deletion after processing",
  "No documents used to train models",
  "Audit logs for business customers",
  "Configurable retention",
  "Enterprise private / on-prem deployment",
];

export default function Security() {
  return (
    <section id="security" className="border-b border-slate-200 bg-slate-900 py-24 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">
            The killer feature
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy isn&apos;t a feature. It&apos;s the product.
          </h2>
          <p className="mt-6 text-slate-300">
            The product itself handles sensitive information, so trust is the
            product. Your documents are private — encrypted, auto-deleted, and
            never used to train models.
          </p>
          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800/60 p-5">
            <p className="text-sm font-semibold text-white">For enterprise customers</p>
            <p className="mt-2 text-sm text-slate-300">
              Run it inside your own infrastructure. On-prem / private-cloud
              deployment for organizations that cannot send documents to an
              external SaaS.
            </p>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-800/40 p-4 text-sm text-slate-200"
            >
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                ✓
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
