import { NextRequest, NextResponse } from "next/server";
import { getUser, createUser } from "@/lib/users";
import { hashPassword } from "@/lib/password";
import { createVerificationToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/mail";
import { appUrl } from "@/lib/app-url";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (typeof email !== "string" || typeof password !== "string" || !email.includes("@") || password.length < 8) {
    return NextResponse.json({ error: "Enter a valid email and a password of at least 8 characters." }, { status: 400 });
  }

  const existing = await getUser(email);
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  await createUser(email, passwordHash);

  const token = await createVerificationToken(email);
  const verifyUrl = appUrl(`/api/verify?token=${token}`);
  await sendEmail(email, "Verify your email", `Click the link to verify your account: ${verifyUrl}`);

  return NextResponse.json({ ok: true });
}
