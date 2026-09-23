import { Page } from "@playwright/test";
import { SignupPage } from "./signup_page";
import { LoginPage } from "./login_page";
import { DashboardPage } from "./dashboard_page";
import { ResetPasswordPage } from "./reset_password_page";

export class PageManager {
  private readonly signupPage: SignupPage;
  private readonly loginPage: LoginPage;
  private readonly dashboardPage: DashboardPage;
  private readonly resetPasswordPage: ResetPasswordPage;

  constructor(page: Page) {
    this.signupPage = new SignupPage(page);
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.resetPasswordPage = new ResetPasswordPage(page);
  }

  onSignupPage() {
    return this.signupPage;
  }

  onLoginPage() {
    return this.loginPage;
  }

  onDashboardPage() {
    return this.dashboardPage;
  }

  onResetPasswordPage() {
    return this.resetPasswordPage;
  }
}
