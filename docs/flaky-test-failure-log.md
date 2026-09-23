# Flaky test: captured failure

`tests/specs/login-redirect.spec.ts`, before the fix in the next commit, asserted on
`page.url()` after a fixed `page.waitForTimeout(300)` instead of waiting on the actual
navigation. Run with `npx playwright test tests/specs/login-redirect.spec.ts --repeat-each=20 --workers=4 --retries=0`:

```
Running 21 tests using 4 workers
  4 failed
  17 passed (29.6s)
```

One captured failure:

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/dashboard"
Received string:    "http://localhost:3000/login?verified=1"
```

Root cause: login is a `fetch` POST that resolves, then the client calls
`window.location.assign("/dashboard")`. The 300ms fixed wait is usually — but not always —
enough for that navigation to complete under parallel load; `page.url()` can read the
pre-navigation value even as the new page is about to render. Fixed by waiting on the
actual condition (`expect(page).toHaveURL(...)`) instead of a fixed timeout.
