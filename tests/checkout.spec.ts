import { test, expect } from '../fixtures/testFixtures';

test.beforeEach(async ({ loginPage }) => {
  await loginPage.navigateToLogin();
  await loginPage.login('standard_user', 'secret_sauce');
});

test('CHK-001 Purchase Backpack and Bike Light end to end', async ({
  inventoryPage,
  cartPage,
  checkoutPage
}) => {
  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.addToCart('Sauce Labs Bike Light');
  await expect(inventoryPage.cartBadge).toHaveText('2');

  await inventoryPage.openCart();
  await cartPage.checkout();
  await checkoutPage.fillInformation('Taylor', 'QA', '10001');
  await checkoutPage.continueToOverview();
  await checkoutPage.finishOrder();

  await expect(checkoutPage.orderConfirmation).toHaveText('Thank you for your order!');
  await expect(inventoryPage.cartBadge).toHaveCount(0);
});

test('CHK-002 Cart badge updates as products are removed', async ({
  inventoryPage,
  cartPage
}) => {
  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.addToCart('Sauce Labs Bike Light');
  await expect(inventoryPage.cartBadge).toHaveText('2');

  await inventoryPage.openCart();
  await cartPage.removeItem('Sauce Labs Backpack');
  await expect(inventoryPage.cartBadge).toHaveText('1');

  await cartPage.removeItem('Sauce Labs Bike Light');
  await expect(inventoryPage.cartBadge).toHaveCount(0);
});

test('CHK-003 Cart lists the added items with matching names and prices', async ({
  inventoryPage,
  cartPage
}) => {
  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.addToCart('Sauce Labs Bike Light');
  await inventoryPage.openCart();

  await expect(cartPage.cartItems).toHaveCount(2);
  await expect(cartPage.itemNames).toHaveText([
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light'
  ]);
  await expect(cartPage.itemPrices).toHaveText(['$29.99', '$9.99']);
});

const checkoutInfoCases = [
  {
    id: 'CHK-004',
    first: '',
    last: 'QA',
    zip: '10001',
    expectedError: 'Error: First Name is required'
  },
  {
    id: 'CHK-005',
    first: 'Taylor',
    last: '',
    zip: '10001',
    expectedError: 'Error: Last Name is required'
  },
  {
    id: 'CHK-006',
    first: 'Taylor',
    last: 'QA',
    zip: '',
    expectedError: 'Error: Postal Code is required'
  }
];

for (const scenario of checkoutInfoCases) {
  test(`${scenario.id} Checkout information validation`, async ({
    inventoryPage,
    cartPage,
    checkoutPage
  }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(scenario.first, scenario.last, scenario.zip);
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toHaveText(scenario.expectedError);
  });
}

test('CHK-007 Last name and zip both empty shows only the Last Name error', async ({
  inventoryPage,
  cartPage,
  checkoutPage
}) => {
  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.openCart();
  await cartPage.checkout();
  await checkoutPage.fillInformation('Taylor', '', '');
  await checkoutPage.continueToOverview();

  await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
});

const TAX_RATE = 0.08; // observed, not specified

const taxScenarios = [
  {
    id: 'CHK-008a',
    name: 'Backpack and Bike Light',
    products: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
    expectedItemTotal: 39.98
  },
  {
    id: 'CHK-008b',
    name: 'Onesie alone',
    products: ['Sauce Labs Onesie'],
    expectedItemTotal: 7.99
  }
];

for (const scenario of taxScenarios) {
  test(`${scenario.id} Tax calculation for ${scenario.name}`, async ({
    inventoryPage,
    cartPage,
    checkoutPage
  }) => {
    for (const product of scenario.products) {
      await inventoryPage.addToCart(product);
    }
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Taylor', 'QA', '10001');
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.itemTotal).toBeVisible();
    await expect(checkoutPage.taxAmount).toBeVisible();
    await expect(checkoutPage.totalAmount).toBeVisible();

    const itemTotal = checkoutPage.parseCurrency(await checkoutPage.itemTotal.innerText());
    const tax = checkoutPage.parseCurrency(await checkoutPage.taxAmount.innerText());
    const total = checkoutPage.parseCurrency(await checkoutPage.totalAmount.innerText());
    const expectedTax = Math.round(itemTotal * TAX_RATE * 100) / 100;

    expect(itemTotal).toBeCloseTo(scenario.expectedItemTotal, 2);
    expect(tax).toBe(expectedTax);
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });
}
