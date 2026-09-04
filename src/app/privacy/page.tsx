import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — PII Redactor",
  description: "How PII Redactor handles, protects, and deletes the documents you upload.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Legal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: September 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">The short version</h2>
              <p className="mt-2">
                Your documents are private. We process them to detect and redact sensitive
                information, we do not use them to train any model, and we automatically delete
                them once the retention window elapses (60 minutes by default, configurable for
                paid plans).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">What we process</h2>
              <p className="mt-2">
                When you upload a document (PDF, DOCX, TXT, CSV, PNG, or JPG), it is sent over an
                encrypted connection to our redaction API. The uploaded file is held in memory
                only for the duration of that single request — it is never written to disk and
                never reused across requests.
              </p>
              <p className="mt-2">
                The output — the redacted document, and, if you request it, a password-protected
                copy of the original — is written to encrypted storage and assigned an expiring,
                unguessable download link. It is deleted automatically once the retention window
                elapses, or immediately if you delete it yourself.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">What we don&apos;t do</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>We do not use your documents, or any text extracted from them, to train machine learning models.</li>
                <li>We do not sell or share your documents with third parties.</li>
                <li>We do not retain your documents beyond your configured retention window.</li>
                <li>
                  We do not store passwords you set for original-file protection — they are used
                  once, in memory, to encrypt the file, and then discarded.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Waitlist and account information</h2>
              <p className="mt-2">
                If you join our waitlist or create an account, we store the information you
                provide (such as your email address) to contact you about early access, product
                updates, and your account. You can ask us to delete this information at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Enterprise and audit logs</h2>
              <p className="mt-2">
                Business and Enterprise customers can enable audit logging, which records
                metadata about redaction activity (e.g. timestamps, categories redacted, entity
                counts) for compliance purposes. Enterprise customers can also run PII Redactor
                entirely within their own infrastructure, so documents never leave their
                environment.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
              <p className="mt-2">
                Questions about this policy or a request to delete your data can be sent to{" "}
                <a href="mailto:privacy@piiredactor.com" className="text-indigo-600 hover:underline">
                  privacy@piiredactor.com
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
