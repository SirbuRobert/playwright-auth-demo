import { SharedPage } from "./shared_page";

export class LoginPage extends SharedPage {
  private readonly emailInput = this.page.getByLabel("Email");
  private readonly passwordInput = this.page.getByLabel("Password");
  private readonly submitButton = this.page.getByRole("button", { name: "Log in" });
  private readonly errorMessage = this.page.getByRole("alert");
  private readonly verifiedStatus = this.page.getByRole("status");

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  get onErrorMessage() {
    return this.errorMessage;
  }

  get onVerifiedStatus() {
    return this.verifiedStatus;
  }
}
