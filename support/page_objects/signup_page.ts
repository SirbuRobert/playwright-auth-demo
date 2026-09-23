import { SharedPage } from "./shared_page";

export class SignupPage extends SharedPage {
  private readonly emailInput = this.main.getByLabel("Email");
  private readonly passwordInput = this.main.getByLabel("Password");
  private readonly submitButton = this.main.getByRole("button", { name: "Sign up" });
  private readonly errorMessage = this.main.getByRole("alert");
  private readonly checkEmailHeading = this.main.getByRole("heading", { name: "Check your email" });

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
