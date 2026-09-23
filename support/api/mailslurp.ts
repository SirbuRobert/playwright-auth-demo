import { InboxDto, MailSlurp } from "mailslurp-client";

const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY! });

export function createTestInbox(): Promise<InboxDto> {
  return mailslurp.inboxController.createInbox({});
}

export async function waitForLatestEmail(inboxId: string): Promise<string> {
  const email = await mailslurp.waitController.waitForLatestEmail({
    inboxId,
    timeout: 30_000,
    unreadOnly: true,
  });
  return email.body ?? "";
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
