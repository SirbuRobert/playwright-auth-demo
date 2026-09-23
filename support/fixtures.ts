import { test as base } from "@playwright/test";
import { PageManager } from "./page_objects/page_manager";

interface Fixtures {
  pageManager: PageManager;
}

export const test = base.extend<Fixtures>({
  pageManager: async ({ page }, use) => {
    await use(new PageManager(page));
  },
});

export { expect } from "@playwright/test";
