import { test, expect } from "@/support/fixtures";
import { createTestInbox, waitForLatestEmail, extractUrl, extractCode } from "@/support/api/mailslurp";

test.use({ storageState: { cookies: [], origins: [] } });

test("resets a forgotten password using a 6-digit code from a real email", async ({ page, pageManager }) => {
  const inbox = await createTestInbox();
  const password = "Playwright-test-1";
  const newPassword = "Playwright-test-2";

  const signupPage = pageManager.onSignupPage();
  await signupPage.goto();
  await signupPage.signUp(inbox.emailAddress, password);

  const verifyEmailBody = await waitForLatestEmail(inbox.id);
  await page.goto(extractUrl(verifyEmailBody));

  const resetPasswordPage = pageManager.onResetPasswordPage();
  await resetPasswordPage.goto();
  await resetPasswordPage.requestCode(inbox.emailAddress);

  const resetEmailBody = await waitForLatestEmail(inbox.id);
  const code = extractCode(resetEmailBody);
  await resetPasswordPage.confirmReset(code, newPassword);
  await expect(resetPasswordPage.onDoneHeading).toBeVisible();

  const loginPage = pageManager.onLoginPage();
  await loginPage.goto();
  await loginPage.login(inbox.emailAddress, newPassword);

  const dashboardPage = pageManager.onDashboardPage();
  await expect(dashboardPage.onHeading).toBeVisible();
});
