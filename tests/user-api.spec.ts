import { test, expect } from '../fixtures/testFixtures';

test('Get user using API fixture', async ({ userApi }) => {

  const user = await userApi.getUser(1);

  expect(user.id).toBe(1);

  expect(user.name).toBeTruthy();

});