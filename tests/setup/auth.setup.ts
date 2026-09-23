import { test as setup, expect } from "@/support/fixtures";
import { createTestInbox, waitForLatestEmail, extractUrl } from "@/support/api/mailslurp";

const authFile = "playwright/.auth/user.json";
const password = "Playwright-test-1";

setup("authenticate", async ({ page, request, pageManager }) => {
  const inbox = await createTestInbox();

  const signupResponse = await request.post("/api/signup", {
    data: { email: inbox.emailAddress, password },
  });
  expect(signupResponse.ok()).toBeTruthy();

  const emailBody = await waitForLatestEmail(inbox.id);
  const verifyUrl = extractUrl(emailBody);
  await page.goto(verifyUrl);

  const loginPage = pageManager.onLoginPage();
  await loginPage.goto();
  await loginPage.login(inbox.emailAddress, password);
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.context().storageState({ path: authFile });
});
