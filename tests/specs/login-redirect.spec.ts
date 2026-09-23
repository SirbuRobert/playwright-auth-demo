import { test, expect } from "@/support/fixtures";
import { createTestEmailAddress, waitForEmailTo, extractUrl } from "@/support/api/ethereal";

test.use({ storageState: { cookies: [], origins: [] } });

test("redirects to the dashboard after login", async ({ page, pageManager }) => {
  const email = createTestEmailAddress();
  const password = "Playwright-test-1";

  const signupPage = pageManager.onSignupPage();
  await signupPage.goto();
  await signupPage.signUp(email, password);

  const { body } = await waitForEmailTo(email);
  await page.goto(extractUrl(body));

  const loginPage = pageManager.onLoginPage();
  await loginPage.login(email, password);

  await expect(page).toHaveURL(/\/dashboard$/);
});
