import { Locator, Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly productName: Locator;

  constructor(page: Page) {
    this.page = page;
    // Scoped to the details view: the inventory list uses the same data-test,
    // so an unscoped locator would match all 6 product names there.
    this.productName = page.locator('[data-test="inventory-item-name"].inventory_details_name');
  }
}
