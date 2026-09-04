"use client";

import { useState, FormEvent } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Recruitment");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm font-medium text-emerald-700">
        You&apos;re on the list. We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
      >
        <option>Recruitment</option>
        <option>Legal</option>
        <option>Finance</option>
        <option>BPO</option>
        <option>AI / Data</option>
        <option>Other</option>
      </select>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
      >
        {status === "loading" ? "Joining..." : "Request early access"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-600 sm:absolute">Enter a valid email address.</p>
      )}
    </form>
  );
}
