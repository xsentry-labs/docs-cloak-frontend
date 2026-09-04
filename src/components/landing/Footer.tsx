import Link from "next/link";
import Logo from "@/components/shared/Logo";

const verticalLinks = [
  { href: "#", label: "PII redaction for recruiters" },
  { href: "#", label: "PII redaction for law firms" },
  { href: "#", label: "PII redaction API" },
  { href: "#", label: "PDF redaction" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            Remove sensitive information from documents in seconds. Upload.
            Redact. Download.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><a href="#how-it-works" className="hover:text-slate-900">How it works</a></li>
              <li><a href="#security" className="hover:text-slate-900">Security</a></li>
              <li><a href="#pricing" className="hover:text-slate-900">Pricing</a></li>
              <li><Link href="/app" className="hover:text-slate-900">Try it free</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Use cases</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              {verticalLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-slate-900">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><a href="#waitlist" className="hover:text-slate-900">Early access</a></li>
              <li><a href="mailto:hello@piiredactor.com" className="hover:text-slate-900">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-6 text-xs text-slate-400">
        © {new Date().getFullYear()} PII Redactor. All rights reserved.
      </p>
    </footer>
  );
}
