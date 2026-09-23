import { randomBytes, randomInt } from "crypto";
import { redis } from "./redis";

const TOKEN_TTL_SECONDS = 15 * 60;

type Purpose = "verify" | "reset";

interface TokenPayload {
  email: string;
}

function tokenKey(purpose: Purpose, token: string): string {
  return `token:${purpose}:${token}`;
}

export async function createVerificationToken(email: string): Promise<string> {
  const token = randomBytes(24).toString("hex");
  await redis().set(tokenKey("verify", token), { email: email.toLowerCase() } satisfies TokenPayload, {
    ex: TOKEN_TTL_SECONDS,
  });
  return token;
}

export async function createResetCode(email: string): Promise<string> {
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  await redis().set(tokenKey("reset", code), { email: email.toLowerCase() } satisfies TokenPayload, {
    ex: TOKEN_TTL_SECONDS,
  });
  return code;
}

export async function consumeToken(token: string, purpose: Purpose): Promise<string | null> {
  const key = tokenKey(purpose, token);
  const payload = await redis().get<TokenPayload>(key);
  if (!payload) return null;
  await redis().del(key);
  return payload.email;
}
