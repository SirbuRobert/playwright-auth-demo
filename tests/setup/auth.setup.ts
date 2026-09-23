import { test as setup, expect } from "@/support/fixtures";
import { createTestEmailAddress, waitForEmailTo, extractUrl } from "@/support/api/ethereal";

const authFile = "playwright/.auth/user.json";
const password = "Playwright-test-1";

setup("authenticate", async ({ page, request, pageManager }) => {
  const email = createTestEmailAddress();

  const signupResponse = await request.post("/api/signup", {
    data: { email, password },
  });
  expect(signupResponse.ok()).toBeTruthy();

  const { body } = await waitForEmailTo(email);
  const verifyUrl = extractUrl(body);
  await page.goto(verifyUrl);

  const loginPage = pageManager.onLoginPage();
  await loginPage.goto();
  await loginPage.login(email, password);
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.context().storageState({ path: authFile });
});
