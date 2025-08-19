import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest';
import { config } from "dotenv";
config();

interface ApiResponse {
  message: string;
  data: any; 
}

describe('Endpoint GET "/api/categories"', () => {
  let body: ApiResponse;
  let response: Response;

  describe('With access token', () => {
    beforeAll(async () => {
      const token = process.env.TOKEN;
      response = await fetch(
        'http://localhost:3000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      body = await response.json();
    });

    test('Should have response status 200', () => {
      expect(response.status).toBe(200);
    });

    test('The response should has a message', () => {
      expectTypeOf(body.message).toBeString();
      expect(body.message).toBe('found all categories');
    });

    test('The response should has the data with categories array', () => {
      expect(body.data).toBeDefined();
     expectTypeOf(body.message).toEqualTypeOf<string>();
    });
  });

  describe('Without access token', () => {
    beforeAll(async () => {
      response = await fetch('http://localhost:3000/api/categories');
      body = await response.json();
    });

    test('Should have response status 401', () => { 
      expect(response.status).toBe(401);
    });

    test('The response should has a message', () => {
      expectTypeOf(body.message).toBeString();
    });
  });

  describe('With invalid access token', () => {
    beforeAll(async () => {
      const token = 'invalid-token';
      response = await fetch(
        'http://localhost:3000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      body = await response.json();
    });

    test('Should have response status 401', () => {
      expect(response.status).toBe(401);
    });

    test('The response should has a message', () => {
      expectTypeOf(body.message).toBeString();
    });
  });
});