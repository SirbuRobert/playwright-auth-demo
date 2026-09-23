import { test, expect } from "@/support/fixtures";
import { createTestEmailAddress, waitForEmailTo, extractUrl } from "@/support/api/ethereal";

test.use({ storageState: { cookies: [], origins: [] } });

test("signs up, follows the verification link from a real email, and logs in", async ({ page, pageManager }) => {
  const email = createTestEmailAddress();
  const password = "Playwright-test-1";

  const signupPage = pageManager.onSignupPage();
  await signupPage.goto();
  await signupPage.signUp(email, password);
  await expect(signupPage.onCheckEmailHeading).toBeVisible();

  const { body } = await waitForEmailTo(email);
  const verifyUrl = extractUrl(body);
  await page.goto(verifyUrl);

  const loginPage = pageManager.onLoginPage();
  await expect(loginPage.onVerifiedStatus).toHaveText("Your email is verified. You can log in now.");
  await loginPage.login(email, password);

  const dashboardPage = pageManager.onDashboardPage();
  await expect(dashboardPage.onHeading).toBeVisible();
});
