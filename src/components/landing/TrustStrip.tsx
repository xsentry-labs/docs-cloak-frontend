const verticals = ["Recruitment", "Legal", "Finance", "BPO", "AI", "Data Annotation"];

export default function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-sm font-medium text-slate-500">
          Built for teams handling sensitive documents
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {verticals.map((v) => (
            <span key={v} className="text-sm font-semibold text-slate-400">
              {v}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
