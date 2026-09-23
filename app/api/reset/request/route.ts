import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/users";
import { createResetCode } from "@/lib/tokens";
import { sendEmail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (typeof email === "string") {
    const user = await getUser(email);
    if (user) {
      const code = await createResetCode(email);
      await sendEmail(email, "Your password reset code", `Your password reset code is: ${code}`);
    }
  }

  // Always respond ok, whether or not the account exists, to avoid leaking registered emails.
  return NextResponse.json({ ok: true });
}
