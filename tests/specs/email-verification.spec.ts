import { test, expect } from "@/support/fixtures";
import { createTestInbox, waitForLatestEmail, extractUrl } from "@/support/api/mailslurp";

test.use({ storageState: { cookies: [], origins: [] } });

test("signs up, follows the verification link from a real email, and logs in", async ({ page, pageManager }) => {
  const inbox = await createTestInbox();
  const password = "Playwright-test-1";

  const signupPage = pageManager.onSignupPage();
  await signupPage.goto();
  await signupPage.signUp(inbox.emailAddress, password);
  await expect(signupPage.onCheckEmailHeading).toBeVisible();

  const emailBody = await waitForLatestEmail(inbox.id);
  const verifyUrl = extractUrl(emailBody);
  await page.goto(verifyUrl);

  const loginPage = pageManager.onLoginPage();
  await expect(loginPage.onVerifiedStatus).toHaveText("Your email is verified. You can log in now.");
  await loginPage.login(inbox.emailAddress, password);

  const dashboardPage = pageManager.onDashboardPage();
  await expect(dashboardPage.onHeading).toBeVisible();
});
