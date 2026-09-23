import { SharedPage } from "./shared_page";

export class DashboardPage extends SharedPage {
  private readonly heading = this.main.getByRole("heading", { name: "Dashboard" });
  private readonly logoutButton = this.main.getByRole("button", { name: "Log out" });

  async goto() {
    await this.page.goto("/dashboard");
  }

  get onHeading() {
    return this.heading;
  }

  async logout() {
    await this.logoutButton.click();
  }
}
