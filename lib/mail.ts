import { MailSlurp } from "mailslurp-client";
import { redis } from "./redis";

let client: MailSlurp | undefined;

function mailslurp(): MailSlurp {
  if (!client) {
    client = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY! });
  }
  return client;
}

const SENDER_INBOX_KEY = "mailslurp:sender-inbox-id";

async function getSenderInboxId(): Promise<string> {
  const cached = await redis().get<string>(SENDER_INBOX_KEY);
  if (cached) return cached;

  const inbox = await mailslurp().inboxController.createInbox({
    name: "auth-demo-sender",
    favourite: true,
  });
  await redis().set(SENDER_INBOX_KEY, inbox.id);
  return inbox.id;
}

export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  const inboxId = await getSenderInboxId();
  await mailslurp().inboxController.sendEmail({
    inboxId,
    sendEmailOptions: { to: [to], subject, body, isHTML: false },
  });
}
