const steps = ["Upload", "Categories", "Review", "Export"];

export default function Stepper({ current }: { current: number }) {
  return (
    <ol className="mx-auto flex max-w-2xl items-center justify-between px-2">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "pending";
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  state === "done"
                    ? "bg-indigo-600 text-white"
                    : state === "active"
                    ? "border-2 border-indigo-600 text-indigo-600"
                    : "border border-slate-300 text-slate-400"
                }`}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <span
                className={`text-xs font-medium ${
                  state === "pending" ? "text-slate-400" : "text-slate-700"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={`mx-2 h-px flex-1 ${i < current ? "bg-indigo-600" : "bg-slate-200"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
