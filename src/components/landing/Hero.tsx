import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50/60 via-white to-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            Privacy-first document redaction
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Remove PII from documents in seconds.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Automatically detect and permanently redact names, emails, phone numbers,
            IDs, financial information and other sensitive data.
          </p>
          <p className="mt-2 text-base font-medium text-slate-500">
            Upload a document → Review → Download
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/app"
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
            >
              Try it free
            </Link>
            <a
              href="#waitlist"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Join the waitlist
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            No credit card required · 10 free documents / month
          </p>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between text-xs font-medium text-slate-400">
              <span>candidate_cv.pdf</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">Redacted</span>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16">Name</span>
                <span className="h-4 flex-1 rounded bg-slate-900" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16">Email</span>
                <span className="h-4 w-2/3 rounded bg-slate-900" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16">Phone</span>
                <span className="h-4 w-1/2 rounded bg-slate-900" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16">Passport</span>
                <span className="h-4 w-1/3 rounded bg-slate-900" />
              </div>
              <div className="pt-2 text-slate-600">
                Reference: Jane Doe can confirm employment history since{" "}
                <span className="inline-block h-4 w-24 translate-y-0.5 rounded bg-slate-900 align-middle" />.
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 -z-10 h-40 w-40 rounded-full bg-indigo-200 blur-3xl" />
          <div className="absolute -top-6 -left-6 -z-10 h-32 w-32 rounded-full bg-emerald-100 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
