import { test, expect } from '../fixtures/testFixtures';

test('User cannot login with invalid credentials', async ({
  loginPage
}) => {
  // Setup
  await loginPage.navigateToLogin();
  
  // Execute - Attempt login with wrong credentials
  await loginPage.usernameInput.fill('invalid_user');
  await loginPage.passwordInput.fill('wrong_password');
  await loginPage.loginButton.click();
  
  // Assert - Error message is displayed
  expect(await loginPage.isErrorDisplayed()).toBeTruthy();
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBeTruthy();
  expect(errorMessage).toContain('Epic sadface');
});

test('Locked out user cannot login', async ({
  loginPage
}) => {
  // Setup
  await loginPage.navigateToLogin();
  
  // Execute - Attempt login with locked out account (will not navigate)
  await loginPage.usernameInput.fill('locked_out_user');
  await loginPage.passwordInput.fill('secret_sauce');
  await loginPage.loginButton.click();
  
  // Wait for error response
  await loginPage.page.waitForLoadState('networkidle');
  
  // Assert - Error message indicates account is locked
  expect(await loginPage.isErrorDisplayed()).toBeTruthy();
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toContain('locked out');
});
