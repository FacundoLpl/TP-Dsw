
import { beforeAll, describe, expect, expectTypeOf, test} from 'vitest';
import { Category } from '../Category/category.entity.js';
import { config } from "dotenv";
config()

interface ApiResponse {
  message: string;
  data: Category[];
}


describe('Endpoint GET "/api/category"', () => {
  let body: ApiResponse;
  let response: Response;

 describe('With access token', () => {
  beforeAll(async () => {
    const token  = process.env.TOKEN;
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
  });
  test('The response should has the data', () => {
    expect(body.data).toBeDefined();
    expectTypeOf(body.data).toBeArray();
  });
 });

 describe('Without access token', () => {
  beforeAll(async () => {
    response = await fetch('http://localhost:3000/api/categories');
    body = await response.json();
  });

  test('Should have response status 401', () => {  // cambiaste 403 por 401
    expect(response.status).toBe(401);
  });

  test('The response should has a message', () => {
    expectTypeOf(body.message).toBeString();
  });
});


 describe('With invalid access token', () => {
    beforeAll(async () => {
      const token = '123';
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

