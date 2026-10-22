import { test, expect } from '../fixtures/testFixtures';

test('TC-LOGIN-001: Successful login with standard_user', async ({
  loginPage,
  inventoryPage
}) => {

  await loginPage.navigateToLogin();

  await loginPage.login(
    'standard_user',
    'secret_sauce'
  );

  await expect(inventoryPage.productsTitle).toBeVisible();

  await expect(inventoryPage.inventoryItems).not.toHaveCount(0);

  await inventoryPage.openMenu();
  await expect(inventoryPage.logoutLink).toBeVisible();

  await expect(loginPage.errorAlert).not.toBeVisible();
});