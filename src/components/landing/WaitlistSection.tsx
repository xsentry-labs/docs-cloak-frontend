import WaitlistForm from "./WaitlistForm";

export default function WaitlistSection() {
  return (
    <section id="waitlist" className="py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Stop manually redacting documents.
        </h2>
        <p className="max-w-xl text-slate-600">
          Start protecting sensitive information automatically. Join the
          waitlist for private beta access, or try the free plan today.
        </p>
        <WaitlistForm />
      </div>
    </section>
  );
}
