import { userSchema } from "../User/user.schema";
import { describe, it, expect } from 'vitest';

describe('User Register Schema', () => {
  it('debería fallar si falta el email', () => {
    const result = userSchema.safeParse({
      password: '123456',
      name: 'Juan',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format()).toHaveProperty('email');
    }
  });

  it('debería aceptar un usuario válido', () => {
  const result = userSchema.safeParse({
    dni: '40222111',
    firstName: 'Juan',
    lastName: 'Pérez',
    userType: 'Client',
    email: 'juan@mail.com',
    password: '123456',
    address: 'Calle Falsa 123',
  });

    expect(result.success).toBe(true);
  });
});
