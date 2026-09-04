import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — PII Redactor",
  description: "The terms that govern your use of PII Redactor.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Legal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: September 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">1. Using the service</h2>
              <p className="mt-2">
                PII Redactor lets you upload documents to automatically detect and redact
                personally identifiable information, and to optionally generate a
                password-protected copy of the original file. You&apos;re responsible for having
                the rights to upload and process any document you submit.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">2. Plans and billing</h2>
              <p className="mt-2">
                The Free plan includes a limited number of documents per month at no cost. Paid
                plans (Starter, Team, Business) are billed on a recurring monthly basis and
                include a defined monthly document allowance and feature set, as described on our
                pricing page. Enterprise plans are governed by a separate agreement. You can
                cancel a paid plan at any time; cancellation takes effect at the end of the
                current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">3. No warranty on detection accuracy</h2>
              <p className="mt-2">
                PII Redactor uses automated detection to identify sensitive information. While we
                aim for high accuracy, automated detection can miss entities or flag false
                positives. You&apos;re responsible for reviewing detected entities before
                exporting a document, especially for regulatory or compliance-sensitive use
                cases. The service is provided &quot;as is&quot; without warranty of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">4. Password-protected files</h2>
              <p className="mt-2">
                If you choose to generate a password-protected copy of your original file, you
                are solely responsible for remembering that password. We do not store it, and we
                have no way to recover or decrypt the file for you if the password is lost.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">5. Acceptable use</h2>
              <p className="mt-2">
                You agree not to use PII Redactor to process documents you don&apos;t have the
                right to handle, to attempt to circumvent usage limits or security controls, or
                to use the service for any unlawful purpose.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">6. Changes</h2>
              <p className="mt-2">
                We may update these terms from time to time. Material changes will be reflected
                by updating the date at the top of this page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">7. Contact</h2>
              <p className="mt-2">
                Questions about these terms can be sent to{" "}
                <a href="mailto:legal@piiredactor.com" className="text-indigo-600 hover:underline">
                  legal@piiredactor.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
