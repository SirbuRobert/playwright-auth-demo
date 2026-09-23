# Deliverables

Evidence for each requirement, with direct links into this repo.

## 1. Public repo, real commit history, main contributor

- Repo: https://github.com/SirbuRobert/playwright-auth-demo (public)
- Commit history: https://github.com/SirbuRobert/playwright-auth-demo/commits/main
  — 17 incremental commits, each one logical step (scaffold → data layer → app
  features → Playwright framework → tests → CI → docs), not one squashed commit.

## 2. Login setup for parallel test sessions

- File+line: [`tests/setup/auth.setup.ts:24`](https://github.com/SirbuRobert/playwright-auth-demo/blob/main/tests/setup/auth.setup.ts#L24)
  — signs up a throwaway account, verifies it via a real emailed link, logs in, and
  saves `storageState` to `playwright/.auth/user.json`.
- Wired as a dependency: [`playwright.config.ts:27-31`](https://github.com/SirbuRobert/playwright-auth-demo/blob/main/playwright.config.ts#L27-L31)
  — the `chromium` project depends on `setup` and loads that saved `storageState`,
  so parallel spec files reuse one already-logged-in session instead of each
  repeating signup/verify/login.
- **Real problem hit while building it:** while writing the page objects this setup
  file uses, `getByRole("alert")` became ambiguous in strict mode — Next.js injects
  its own `<div role="alert">` route announcer on every page, which collided with
  this app's own error banners. Fixed by scoping every page-object locator to the
  page's `<main>` element: [commit `0bc4f3d`](https://github.com/SirbuRobert/playwright-auth-demo/commit/0bc4f3d).

## 3. CI run: parallel shards

- Workflow: [`.github/workflows/playwright.yml`](https://github.com/SirbuRobert/playwright-auth-demo/blob/main/.github/workflows/playwright.yml)
  — 3-way shard matrix (`--shard=1/3`, `2/3`, `3/3`), one job per shard.
- Run: https://github.com/SirbuRobert/playwright-auth-demo/actions/runs/35888889741
  (all 3 jobs green)
  - shard 1/3 — 91s
  - shard 2/3 — 76s
  - shard 3/3 — 73s

## 4. Flaky test: caught, then fixed

- Caught (genuinely intermittent — 4 failed / 21 passed under `--repeat-each=20`,
  logged in [`docs/flaky-test-failure-log.md`](https://github.com/SirbuRobert/playwright-auth-demo/blob/main/docs/flaky-test-failure-log.md)):
  [commit `7cbfea4`](https://github.com/SirbuRobert/playwright-auth-demo/commit/7cbfea4)
  "Add test for login redirect (currently intermittent)"
- Cause: login resolves a `fetch` POST, then the client calls
  `window.location.assign("/dashboard")`. A fixed `page.waitForTimeout(300)` was
  usually — but not always — enough for that navigation to land before the
  assertion ran.
- Fixed (verified stable across 20+ repeated runs afterward):
  [commit `e3d787f`](https://github.com/SirbuRobert/playwright-auth-demo/commit/e3d787f)
  "Fix flaky test: wait on navigation instead of a fixed timeout" — the diff swaps
  the fixed wait + `page.url()` check for `expect(page).toHaveURL(...)`, which
  waits on the actual condition.

## 5. Email test: real email, followed by an action

Two variants, both against a real mailbox (Ethereal), not a mock:

- **Link:** [`tests/specs/email-verification.spec.ts`](https://github.com/SirbuRobert/playwright-auth-demo/blob/main/tests/specs/email-verification.spec.ts)
  ([commit `64aeb08`](https://github.com/SirbuRobert/playwright-auth-demo/commit/64aeb08))
  — signs up, fetches the real verification email over IMAP, extracts the link,
  navigates to it, logs in.
- **Code:** [`tests/specs/password-reset.spec.ts`](https://github.com/SirbuRobert/playwright-auth-demo/blob/main/tests/specs/password-reset.spec.ts)
  ([commit `418bae1`](https://github.com/SirbuRobert/playwright-auth-demo/commit/418bae1))
  — requests a password reset, fetches the real 6-digit code from the same
  mailbox, types it in, logs in with the new password.

## Bonus: live deploy

- https://playwright-auth-demo.vercel.app — signup → real email → verify → login
  confirmed working end-to-end against the deployed instance.

## 6. Recording

[`docs/recording.mov`](https://github.com/SirbuRobert/playwright-auth-demo/blob/main/docs/recording.mov)
— 5-minute walkthrough covering items 1 and 2 above.
