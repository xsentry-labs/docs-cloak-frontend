export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white text-sm">
        ⛶
      </span>
      <span>
        PII<span className="text-indigo-600">Redactor</span>
      </span>
    </span>
  );
}
