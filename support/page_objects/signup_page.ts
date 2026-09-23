import { SharedPage } from "./shared_page";

export class SignupPage extends SharedPage {
  private readonly emailInput = this.page.getByLabel("Email");
  private readonly passwordInput = this.page.getByLabel("Password");
  private readonly submitButton = this.page.getByRole("button", { name: "Sign up" });
  private readonly errorMessage = this.page.getByRole("alert");
  private readonly checkEmailHeading = this.page.getByRole("heading", { name: "Check your email" });

  async goto() {
    await this.page.goto("/signup");
  }

  async signUp(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  get onCheckEmailHeading() {
    return this.checkEmailHeading;
  }

  get onErrorMessage() {
    return this.errorMessage;
  }
}
