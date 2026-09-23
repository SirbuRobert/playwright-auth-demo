import { randomUUID } from "crypto";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

export function createTestEmailAddress(): string {
  return `test-${randomUUID()}@playwright-demo.test`;
}

export interface ReceivedEmail {
  body: string;
  uid: number;
}

/**
 * Polls the shared Ethereal test mailbox for a message addressed to `to`.
 * Pass the previous result's `uid` as `afterUid` when waiting for a second,
 * later email to the same address (e.g. a verification link followed by a
 * reset code) so a stale match isn't returned before the new one arrives.
 */
export async function waitForEmailTo(
  to: string,
  { timeoutMs = 30_000, afterUid }: { timeoutMs?: number; afterUid?: number } = {},
): Promise<ReceivedEmail> {
  const client = new ImapFlow({
    host: "imap.ethereal.email",
    port: 993,
    secure: true,
    auth: {
      user: process.env.ETHEREAL_USER!,
      pass: process.env.ETHEREAL_PASS!,
    },
    logger: false,
  });
  await client.connect();

  try {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const lock = await client.getMailboxLock("INBOX");
      try {
        const uids = ((await client.search({ to }, { uid: true })) || []).filter(
          (uid) => afterUid === undefined || uid > afterUid,
        );
        if (uids.length > 0) {
          const latestUid = uids[uids.length - 1];
          // Under concurrent access to the shared test mailbox, a download can
          // occasionally come back empty; treat that as "not ready yet" and retry
          // rather than failing the whole wait.
          const { content } = await client.download(latestUid, undefined, { uid: true });
          if (content) {
            const parsed = await simpleParser(content);
            return { body: parsed.text ?? "", uid: latestUid };
          }
        }
      } finally {
        lock.release();
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    throw new Error(`Timed out waiting for an email to ${to}`);
  } finally {
    await client.logout();
  }
}

export function extractUrl(body: string): string {
  const match = body.match(/https?:\/\/\S+/);
  if (!match) throw new Error("No URL found in email body");
  return match[0];
}

export function extractCode(body: string): string {
  const match = body.match(/\b\d{6}\b/);
  if (!match) throw new Error("No 6-digit code found in email body");
  return match[0];
}
