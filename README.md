# Playwright Auth Demo

A small, self-contained Next.js app — signup, email verification, login, and password
reset — built to be tested, not to be a product. It exists to demonstrate a Playwright
test suite against a real running app with real email delivery, not against a mocked
backend.

## The app

- **Sign up** with email + password. Sends a verification link by email; the account
  can't log in until it's clicked.
- **Log in / log out** with a signed, `httpOnly` session cookie ([iron-session](https://github.com/vvo/iron-session)).
- **Password reset** by emailing a 6-digit code, entered on `/reset-password`.
- **Dashboard**, a protected page that redirects to `/login` without a session.

Stack: Next.js (App Router) + TypeScript, [Upstash Redis](https://upstash.com) for the
user/token store, [Ethereal](https://ethereal.email) for email delivery, [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
for password hashing.

## Test data: why Ethereal

Tests need to receive real, deliverable email — clicking a verification link or reading
a reset code only means something if the email actually arrived. Ethereal is
nodemailer's disposable SMTP/IMAP service: free, no signup, and every message sent
through it is retrievable over IMAP from the same account. Tests generate a unique
throwaway address per run (`support/api/ethereal.ts`), sign up with it, and poll the
shared Ethereal mailbox by `to` address until the matching email shows up.

(The project briefly used [MailSlurp](https://mailslurp.com) instead — one real disposable
inbox per test, which is a nicer model — until its free-tier inbox-creation quota ran out
during development. Ethereal has no such cap.)

## Project layout

```
app/                        # Next.js app (signup, login, reset, dashboard) + API routes
lib/                        # Redis-backed user/token store, password hashing, session, mail
tests/
  setup/auth.setup.ts        # logs in once, saves storageState for parallel test projects
  specs/                      # spec files
support/
  page_objects/               # POM classes + page_manager.ts registry
  fixtures.ts                 # custom `test` export (always import this, not @playwright/test)
  api/ethereal.ts              # test inbox address + real email fetch/parse helpers
.github/workflows/playwright.yml
playwright.config.ts
```

## Running it locally

1. Copy `.env.example` to `.env` and fill in:
   - Upstash Redis REST URL + token
   - An Ethereal test account (`node -e "require('nodemailer').createTestAccount().then(a => console.log(a))"`)
   - A random 32+ character `SESSION_PASSWORD`
2. `npm install`
3. `npm run dev` — app on http://localhost:3000
4. `npx playwright test` — Playwright starts the dev server itself if it isn't already running

## Parallel test sessions

`tests/setup/auth.setup.ts` signs up a throwaway account, verifies it via a real emailed
link, logs in, and saves the authenticated browser state to `playwright/.auth/user.json`.
`playwright.config.ts` wires this as a `setup` project that every other project depends
on, so parallel spec files reuse one already-logged-in session instead of each repeating
the signup/verify/login flow.

## CI

`.github/workflows/playwright.yml` runs the suite as a 3-way shard matrix
(`--shard=1/3`, `2/3`, `3/3`), each shard a separate job. Requires these repository
secrets: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ETHEREAL_USER`,
`ETHEREAL_PASS`, `SESSION_PASSWORD`.

## What I'd change with more time

- One shared Ethereal mailbox across all tests works at this scale but wouldn't scale
  cleanly to a much bigger suite — a real per-test inbox provider (MailSlurp, on a paid
  tier) is the better long-term model.
- The app has no rate limiting on signup/login/reset — fine for a test target, not for
  anything real.
