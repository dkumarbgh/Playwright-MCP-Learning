import { test, expect } from '@playwright/test';

test('Login and verify application', async ({ page }) => {

  // Arrange
  await page.goto('https://www.saucedemo.com/');

  // Verify login page
  await expect(page).toHaveTitle(/Swag Labs/);

  // Act
  await page
    .getByPlaceholder('Username')
    .fill('standard_user');

  await page
    .getByPlaceholder('Password')
    .fill('secret_sauce');

  await page
    .getByRole('button', { name: 'Login' })
    .click();

  // Assert
  await expect(page).toHaveURL(/inventory12/);

  await expect(
    page.getByText('Products')
  ).toBeVisible();

});