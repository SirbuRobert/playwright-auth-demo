import { Page } from "@playwright/test";

export class SharedPage {
  constructor(protected readonly page: Page) {}

  protected get main() {
    return this.page.locator("main");
  }
}
