import { APIRequestContext, expect } from '@playwright/test';

export class UserApi {

  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getUser(userId: number) {

    const response = await this.request.get(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );

    expect(response.status()).toBe(200);

    return await response.json();
  }

  async createUser(name: string, username: string, email: string) {

    const response = await this.request.post(
      'https://jsonplaceholder.typicode.com/users',
      {
        data: {
          name,
          username,
          email
        }
      }
    );

    expect(response.status()).toBe(201);

    return await response.json();
  }
}