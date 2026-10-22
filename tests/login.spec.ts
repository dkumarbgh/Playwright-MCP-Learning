import { test, expect } from '@playwright/test';

test('Successful login', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

  await page
    .getByPlaceholder('Username')
    .fill('standard_user');

  await page
    .getByPlaceholder('Password')
    .fill('secret_sauce');

  await page
    .getByRole('button', { name: 'Login' })
    .click();

const buttons = page.getByRole('button', { name: 'Add to Cart' });

console.log(await buttons.count());
await buttons.first().click();

  await page.locator('[data-test="shopping-cart-link"]').click();

  await expect(
    page.getByText('Remove')
  ).toBeVisible();

});