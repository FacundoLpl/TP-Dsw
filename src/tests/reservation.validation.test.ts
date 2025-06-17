import { describe, it, expect } from 'vitest'

describe('POST /api/reservation - Validación', () => {
  it('debería fallar si no se envía el user', async () => {
    const response = await fetch('http://localhost:3000/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datetime: '2025-06-12T19:00:00Z',
        people: 2
        // Falta el campo "user"
      })
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    // body.message es el string genérico o el array de errores? Ajustar según tu backend.
    expect(body).toHaveProperty('message');
    // Podés revisar que el mensaje contenga el texto de error de Zod para "user"
    expect(body.message).toMatch(/user/i);
  });

  it('debería fallar si no se envía la fecha (datetime)', async () => {
    const response = await fetch('http://localhost:3000/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: 'Juan Pérez',
        people: 2
        // Falta el campo "datetime"
      })
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body.message).toMatch(/datetime/i);
  });
});
