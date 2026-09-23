import { Page } from "@playwright/test";

export class SharedPage {
  constructor(protected readonly page: Page) {}
}
