import { describe, it, expect } from 'vitest'
import { config } from 'dotenv'

config()
const token = process.env.TOKEN

describe('POST /api/reservations - Validación', () => {
  it('debería fallar si no se envía el user', async () => {
    const response = await fetch('http://localhost:3000/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        datetime: '2025-06-12T19:00:00Z',
        people: 2
      })
    })

    expect(response.status).toBe(400) 
    const body = await response.json()
    expect(body).toHaveProperty('message')
    expect(body.message).toMatch(/user/i)
  })

  it('debería fallar si no se envía la fecha (datetime)', async () => {
    const response = await fetch('http://localhost:3000/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user: 'testuserid',
        people: 2
      })
    })

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body).toHaveProperty('message')
    expect(body.message).toMatch(/datetime/i)
  })
})
