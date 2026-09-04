import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.email !== "string" || !body.email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  // MVP: no persistence layer yet. Log for manual follow-up during private beta.
  console.log("[waitlist] signup", { email: body.email, role: body.role ?? "unspecified" });

  return NextResponse.json({ status: "ok" });
}
