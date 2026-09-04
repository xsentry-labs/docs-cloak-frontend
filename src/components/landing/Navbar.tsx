import Link from "next/link";
import Logo from "@/components/shared/Logo";

const links = [
  { href: "#how-it-works", label: "Product" },
  { href: "#security", label: "Security" },
  { href: "#api", label: "API" },
  { href: "#pricing", label: "Pricing" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Try it free
          </Link>
        </div>
      </nav>
    </header>
  );
}
