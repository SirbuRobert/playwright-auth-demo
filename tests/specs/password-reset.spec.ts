import { test, expect } from "@/support/fixtures";
import { createTestEmailAddress, waitForEmailTo, extractUrl, extractCode } from "@/support/api/ethereal";

test.use({ storageState: { cookies: [], origins: [] } });

test("resets a forgotten password using a 6-digit code from a real email", async ({ page, pageManager }) => {
  const email = createTestEmailAddress();
  const password = "Playwright-test-1";
  const newPassword = "Playwright-test-2";

  const signupPage = pageManager.onSignupPage();
  await signupPage.goto();
  await signupPage.signUp(email, password);

  const verifyEmail = await waitForEmailTo(email);
  await page.goto(extractUrl(verifyEmail.body));

  const resetPasswordPage = pageManager.onResetPasswordPage();
  await resetPasswordPage.goto();
  await resetPasswordPage.requestCode(email);

  const resetEmail = await waitForEmailTo(email, { afterUid: verifyEmail.uid });
  const code = extractCode(resetEmail.body);
  await resetPasswordPage.confirmReset(code, newPassword);
  await expect(resetPasswordPage.onDoneHeading).toBeVisible();

  const loginPage = pageManager.onLoginPage();
  await loginPage.goto();
  await loginPage.login(email, newPassword);

  const dashboardPage = pageManager.onDashboardPage();
  await expect(dashboardPage.onHeading).toBeVisible();
});
