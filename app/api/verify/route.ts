import { NextRequest, NextResponse } from "next/server";
import { consumeToken } from "@/lib/tokens";
import { markVerified } from "@/lib/users";
import { appUrl } from "@/lib/app-url";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const email = token ? await consumeToken(token, "verify") : null;

  if (!email) {
    return NextResponse.redirect(appUrl("/login?error=invalid-token"));
  }

  await markVerified(email);
  return NextResponse.redirect(appUrl("/login?verified=1"));
}
