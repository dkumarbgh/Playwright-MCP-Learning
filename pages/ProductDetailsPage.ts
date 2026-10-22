import { Locator, Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly productName: Locator;

  constructor(page: Page) {
    this.productName = page.locator('[data-test="inventory-item-name"]');
  }
}
