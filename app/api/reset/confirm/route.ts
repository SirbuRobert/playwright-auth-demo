import { NextRequest, NextResponse } from "next/server";
import { consumeToken } from "@/lib/tokens";
import { setPassword } from "@/lib/users";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  const { code, password } = await request.json();

  if (typeof code !== "string" || typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Enter the code and a password of at least 8 characters." }, { status: 400 });
  }

  const email = await consumeToken(code, "reset");
  if (!email) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  await setPassword(email, await hashPassword(password));
  return NextResponse.json({ ok: true });
}
