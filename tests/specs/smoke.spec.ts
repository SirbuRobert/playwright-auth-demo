import { test, expect } from "@/support/fixtures";
import { createTestInbox } from "@/support/api/mailslurp";

const password = "Playwright-test-1";

test.describe("signup and login", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("rejects login before the account is verified", async ({ pageManager }) => {
    const inbox = await createTestInbox();

    const signupPage = pageManager.onSignupPage();
    await signupPage.goto();
    await signupPage.signUp(inbox.emailAddress, password);
    await expect(signupPage.onCheckEmailHeading).toBeVisible();

    const loginPage = pageManager.onLoginPage();
    await loginPage.goto();
    await loginPage.login(inbox.emailAddress, password);
    await expect(loginPage.onErrorMessage).toHaveText("Please verify your email before logging in.");
  });
});

test.describe("dashboard access", () => {
  test("an authenticated session can reach the dashboard", async ({ pageManager }) => {
    const dashboardPage = pageManager.onDashboardPage();
    await dashboardPage.goto();
    await expect(dashboardPage.onHeading).toBeVisible();
  });
});
