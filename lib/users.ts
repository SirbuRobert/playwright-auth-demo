import { redis } from "./redis";

export interface User {
  email: string;
  passwordHash: string;
  verified: boolean;
}

function userKey(email: string): string {
  return `user:${email.toLowerCase()}`;
}

export async function getUser(email: string): Promise<User | null> {
  return redis().get<User>(userKey(email));
}

export async function createUser(email: string, passwordHash: string): Promise<User> {
  const user: User = { email: email.toLowerCase(), passwordHash, verified: false };
  await redis().set(userKey(email), user);
  return user;
}

export async function markVerified(email: string): Promise<void> {
  const user = await getUser(email);
  if (!user) return;
  await redis().set(userKey(email), { ...user, verified: true });
}

export async function setPassword(email: string, passwordHash: string): Promise<void> {
  const user = await getUser(email);
  if (!user) return;
  await redis().set(userKey(email), { ...user, passwordHash });
}
