// tests/hash.test.ts
import { describe, expect, test } from 'vitest';
import { hashPassword, comparePassword } from '../utils/hash';

describe('Password hashing', () => {
  const password = 'secure123';

  test('should hash the password', async () => {
    const hashed = await hashPassword(password);
    expect(hashed).not.toBe(password);
    expect(hashed.length).toBeGreaterThan(10);
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

  test('should throw if trying to hash empty string', async () => {
    await expect(() => hashPassword('')).rejects.toThrow();
  });

  test('should throw if trying to hash null', async () => {
    // @ts-expect-error deliberately passing invalid input
    await expect(() => hashPassword(null)).rejects.toThrow();
  });

  test('should throw if trying to hash undefined', async () => {
    // @ts-expect-error deliberately passing invalid input
    await expect(() => hashPassword(undefined)).rejects.toThrow();
  });

  test('should return false when comparing empty password', async () => {
    const hashed = await hashPassword('somepass');
    const result = await comparePassword('', hashed);
    expect(result).toBe(false);
  });

  test('should return false when comparing null password', async () => {
    const hashed = await hashPassword('somepass');
    // @ts-expect-error deliberately passing invalid input
    const result = await comparePassword(null, hashed);
    expect(result).toBe(false);
  });

  test('should return false when comparing undefined password', async () => {
    const hashed = await hashPassword('somepass');
    // @ts-expect-error deliberately passing invalid input
    const result = await comparePassword(undefined, hashed);
    expect(result).toBe(false);
  });
});
