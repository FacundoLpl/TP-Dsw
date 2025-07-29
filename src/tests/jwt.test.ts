import { describe, test, expect } from 'vitest'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

describe('JWT token signing and verification', () => {
  test('debería firmar y verificar un token correctamente', () => {
    const payload = { id: '123', userType: 'Admin' }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

    const decoded = jwt.verify(token, JWT_SECRET) as typeof payload

    expect(decoded.id).toBe(payload.id)
    expect(decoded.userType).toBe(payload.userType)
  })

  test('debería fallar si el token es inválido', () => {
    const invalidToken = 'abc.def.ghi'

    expect(() => jwt.verify(invalidToken, JWT_SECRET)).toThrow()
  })

  test('debería fallar si el token está expirado', () => {
    const expiredToken = jwt.sign({ id: '123', userType: 'Admin' }, JWT_SECRET, { expiresIn: -10 })

    expect(() => jwt.verify(expiredToken, JWT_SECRET)).toThrow(/jwt expired/)
  })
})
