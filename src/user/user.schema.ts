import { z } from "zod"

// User validation schema
export const userSchema = z.object({
  dni: z.string().min(1, "DNI es requerido"),
  firstName: z.string().min(1, "Nombre es requerido"),
  lastName: z.string().min(1, "Apellido es requerido"),
  userType: z.enum(["Admin", "Client", "Mozo"]),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  address: z.string().optional(),
})

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña es requerida"),
})

// Validation functions
export function validateUser(data: unknown) {
  return userSchema.safeParse(data)
}

export function validateLogin(data: unknown) {
  return loginSchema.safeParse(data)
}
