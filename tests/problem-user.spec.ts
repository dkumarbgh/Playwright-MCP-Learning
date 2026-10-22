import { test, expect } from '../fixtures/testFixtures';

test.beforeEach(async ({ loginPage }) => {
  await loginPage.navigateToLogin();
  await loginPage.login('problem_user', 'secret_sauce');
});

test('PU-001 Checkout information fields retain their values', async ({
  inventoryPage,
  cartPage,
  checkoutPage
}) => {
  test.fail(); // PU-001

  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.openCart();
  await cartPage.checkout();
  await checkoutPage.fillInformation('Taylor', 'QA', '10001');

  await expect(checkoutPage.firstNameInput).toHaveValue('Taylor');
  await expect(checkoutPage.lastNameInput).toHaveValue('QA');
});

test('PU-002 Sorting Z–A puts the last product first', async ({ inventoryPage }) => {
  test.fail(); // PU-002

  await inventoryPage.sortBy('za');

  await expect(
    inventoryPage.inventoryItems.first().locator('[data-test="inventory-item-name"]')
  ).toHaveText('Test.allTheThings() T-Shirt (Red)');
});

test('PU-003 Opening the Backpack name shows its details', async ({
  page,
  inventoryPage,
  productDetailsPage
}) => {
  test.fail(); // PU-003

  await inventoryPage.openProduct('Sauce Labs Backpack');

  // Pin the failure reason: first check we navigated to the Backpack's own page (id=4).
  // Observed defect: Firefox/WebKit open id=5 (Fleece Jacket); Chromium stays on /inventory.html.
  await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
  await expect(productDetailsPage.productName).toHaveText('Sauce Labs Backpack');
});

const addToCartCases = [
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Test.allTheThings() T-Shirt (Red)'
];

for (const productName of addToCartCases) {
  test(`PU-004 Add to cart changes to Remove for ${productName}`, async ({
    inventoryPage
  }) => {
    test.fail(); // PU-004

    await inventoryPage.addToCart(productName);

    await expect(
      inventoryPage.inventoryItems
        .filter({ hasText: productName })
        .getByRole('button', { name: 'Remove' })
    ).toBeVisible();
  });
}
