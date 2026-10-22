import { Page, Locator } from '@playwright/test';

export class LoginPage {

  readonly page: Page;
  readonly loginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {

    this.page = page;
    // Use data-test attributes for stable, maintainable locators
    this.usernameInput = page.locator('input[data-test="username"]');
    this.passwordInput = page.locator('input[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorAlert = page.locator('[data-test="error"]');
  }

  async navigateToLogin() {
    await this.page.goto('/', { waitUntil: 'networkidle' });
  }

  async login(username: string, password: string) {

    await this.usernameInput.fill(username);

    await this.passwordInput.fill(password);

    await this.loginButton.click();
    
    // Wait for successful navigation to inventory page
    await this.page.waitForURL(/inventory\.html/, { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage(): Promise<string | null> {
    try {
      if (await this.errorAlert.isVisible()) {
        return await this.errorAlert.textContent();
      }
    } catch (error) {
      // Element not present
    }
    return null;
  }

  async isErrorDisplayed(): Promise<boolean> {
    try {
      return await this.errorAlert.isVisible();
    } catch {
      return false;
    }
  }
}