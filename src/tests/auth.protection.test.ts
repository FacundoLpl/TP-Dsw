import { describe, test, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { authenticateToken } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/authMiddleware'




// Este archivo testea el middleware de autenticación y autorización.
// Verifica que:
// - El token sea requerido y válido.
// - El token expirado sea rechazado correctamente.
// - El middleware de roles permita o deniegue acceso según el tipo de usuario.
// - Si `next()` se llama correctamente cuando el token es válido.








const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

let req: any
let res: any
let next: any

beforeEach(() => {
  req = {
    headers: {},
  }
  res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }
  next = vi.fn()
})

describe('authenticateToken', () => {
  test('debe rechazar si no hay token', () => {
    authenticateToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 'MISSING_TOKEN',
      message: 'Authentication token is required',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('debe rechazar si el token es inválido', () => {
    req.headers.authorization = 'Bearer invalid.token.value'

    authenticateToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 'INVALID_TOKEN',
      message: 'Invalid token',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('debe rechazar si el token está expirado', () => {
    const expiredToken = jwt.sign({ id: '1', userType: 'User' }, JWT_SECRET, { expiresIn: -10 })
    req.headers.authorization = `Bearer ${expiredToken}`

    authenticateToken(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 'TOKEN_EXPIRED',
      message: 'Token has expired',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('debe aceptar si el token es válido y llamar a next', () => {
    const validPayload = { id: '123', userType: 'User' }
    const token = jwt.sign(validPayload, JWT_SECRET, { expiresIn: '1h' })
    req.headers.authorization = `Bearer ${token}`

    authenticateToken(req, res, next)

    expect(req.user).toEqual(validPayload)
    expect(next).toHaveBeenCalled()
  })
})

describe('roleMiddleware', () => {
  test('debe rechazar si no hay usuario en req', () => {
    const middleware = roleMiddleware(['Admin'])

    middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      code: 'MISSING_TOKEN',
      message: 'Authentication token is required',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('debe rechazar si el usuario no tiene el rol adecuado', () => {
    const middleware = roleMiddleware(['Admin'])
    req.user = { id: '123', userType: 'User' }

    middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      code: 'FORBIDDEN',
      message: 'Access denied: insufficient permissions',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('debe aceptar si el usuario tiene el rol adecuado', () => {
    const middleware = roleMiddleware(['Admin'])
    req.user = { id: '123', userType: 'Admin' }

    middleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
