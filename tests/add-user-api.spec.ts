
import { test, expect } from '../fixtures/testFixtures';
test('Create user using API fixture', async ({ userApi }) => {

  const user = await userApi.createUser(
    'Deepak',
    'deepakqa',
    'deepak@example.com'
  );

  expect(user.name).toBe('Deepak');

  expect(user.username).toBe('deepakqa');

});