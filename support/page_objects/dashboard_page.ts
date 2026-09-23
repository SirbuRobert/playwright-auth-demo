import { SharedPage } from "./shared_page";

export class DashboardPage extends SharedPage {
  private readonly heading = this.page.getByRole("heading", { name: "Dashboard" });
  private readonly logoutButton = this.page.getByRole("button", { name: "Log out" });

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
