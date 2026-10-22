import { Page, Locator } from '@playwright/test';

export class InventoryPage {

  readonly page: Page;
  readonly productsTitle: Locator;
  readonly inventoryItems: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly addToCartButton: Locator;
  readonly logoutLink: Locator;
  readonly menuButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.productsTitle = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
  }

  async verifyLoginSuccess(): Promise<boolean> {
    try {
      const headerVisible = await this.productsTitle.isVisible();
      const itemsExist = (await this.inventoryItems.count()) > 0;
      const logoutAvailable = await this.logoutLink.isVisible();

      return headerVisible && itemsExist && logoutAvailable;
    } catch {
      return false;
    }
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async addFirstProductToCart() {
    await this.addToCartButton.first().click();
  }

  async addToCart(productName: string) {
    await this.inventoryItems
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async sortBy(option: string) {
    await this.page.locator('[data-test="product-sort-container"]').selectOption(option);
  }

  async openProduct(name: string) {
    await this.inventoryItems
      .filter({ hasText: name })
      .locator('[data-test="inventory-item-name"]')
      .click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async openMenu() {
    await this.menuButton.click();
  }
}