// tests/hash.test.ts
import { describe, expect, test } from 'vitest';
import { hashPassword, comparePassword } from '../utils/hash';

describe('Password hashing', () => {
  const password = 'secure123';

  test('should hash the password', async () => {
    const hashed = await hashPassword(password);
    expect(hashed).not.toBe(password);
    expect(hashed.length).toBeGreaterThan(10); // solo para validar que devuelve algo razonable
  });

  test('should compare password and return true for correct input', async () => {
    const hashed = await hashPassword(password);
    const result = await comparePassword(password, hashed);
    expect(result).toBe(true);
  });

  test('should return false for incorrect password', async () => {
    const hashed = await hashPassword(password);
    const result = await comparePassword('wrongpass', hashed);
    expect(result).toBe(false);
  });
});
