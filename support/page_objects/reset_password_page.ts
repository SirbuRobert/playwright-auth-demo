import { SharedPage } from "./shared_page";

export class ResetPasswordPage extends SharedPage {
  private readonly emailInput = this.page.getByLabel("Email");
  private readonly sendCodeButton = this.page.getByRole("button", { name: "Send code" });
  private readonly codeInput = this.page.getByLabel("Code");
  private readonly newPasswordInput = this.page.getByLabel("New password");
  private readonly resetButton = this.page.getByRole("button", { name: "Reset password" });
  private readonly errorMessage = this.page.getByRole("alert");
  private readonly doneHeading = this.page.getByRole("heading", { name: "Password updated" });

  async goto() {
    await this.page.goto("/reset-password");
  }

  async requestCode(email: string) {
    await this.emailInput.fill(email);
    await this.sendCodeButton.click();
  }

  async confirmReset(code: string, newPassword: string) {
    await this.codeInput.fill(code);
    await this.newPasswordInput.fill(newPassword);
    await this.resetButton.click();
  }

  get onErrorMessage() {
    return this.errorMessage;
  }

  get onDoneHeading() {
    return this.doneHeading;
  }
}
