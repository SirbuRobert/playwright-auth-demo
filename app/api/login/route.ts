import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/users";
import { verifyPassword } from "@/lib/password";
import { getSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const user = await getUser(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (!user.verified) {
    return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 403 });
  }

  const session = await getSession();
  session.email = user.email;
  await session.save();

  return NextResponse.json({ ok: true });
}
