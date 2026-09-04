const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "",
    features: ["10 documents/month", "Basic PII categories", "Web interface"],
    cta: "Start for free",
    href: "/app",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$19",
    cadence: "/month",
    features: ["250 documents/month", "All PII categories", "Manual review", "Export"],
    cta: "Get started",
    href: "/app",
    highlight: false,
  },
  {
    name: "Team",
    price: "$79",
    cadence: "/month",
    features: [
      "2,500 documents/month",
      "Team members",
      "Audit logs",
      "API access",
      "Custom retention",
    ],
    cta: "Get started",
    href: "/app",
    highlight: true,
  },
  {
    name: "Business",
    price: "$299",
    cadence: "/month",
    features: [
      "15,000 documents/month",
      "Advanced API",
      "Priority processing",
      "SSO",
      "Advanced audit logs",
    ],
    cta: "Talk to sales",
    href: "#waitlist",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    features: [
      "Private deployment",
      "On-premise",
      "Custom retention",
      "SSO / SAML",
      "Dedicated support",
    ],
    cta: "Contact us",
    href: "#waitlist",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-slate-200 bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple, usage-based pricing
          </h2>
          <p className="mt-4 text-slate-600">
            Start free. Upgrade as your document volume grows.
          </p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                plan.highlight
                  ? "border-indigo-600 bg-white shadow-lg ring-1 ring-indigo-600"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.highlight && (
                <span className="mb-3 inline-block w-fit rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.cadence}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-600">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-indigo-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`mt-6 rounded-lg px-4 py-2 text-center text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">
          Pricing can eventually transition from documents to pages/usage
          depending on customer behaviour.
        </p>
      </div>
    </section>
  );
}
