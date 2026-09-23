import { SharedPage } from "./shared_page";

export class ResetPasswordPage extends SharedPage {
  private readonly emailInput = this.main.getByLabel("Email");
  private readonly sendCodeButton = this.main.getByRole("button", { name: "Send code" });
  private readonly codeInput = this.main.getByLabel("Code");
  private readonly newPasswordInput = this.main.getByLabel("New password");
  private readonly resetButton = this.main.getByRole("button", { name: "Reset password" });
  private readonly errorMessage = this.main.getByRole("alert");
  private readonly doneHeading = this.main.getByRole("heading", { name: "Password updated" });

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
