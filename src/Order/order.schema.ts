import { z as zod } from "zod"

const orderSchema = zod.object({
  subtotal: zod.number().min(0, "subtotal must be positive"),
  product: zod.string(),
  quantity: zod.number().int("quantity must be a positive integer").min(1),
  cart: zod.string().optional(),
})

type OrderValidationResult =
  | zod.SafeParseSuccess<zod.infer<typeof orderSchema>>
  | zod.SafeParseError<zod.infer<typeof orderSchema>>

export function validateOrder(data: any): OrderValidationResult {

  if (typeof data.quantity === "string") {
    data.quantity = Number(data.quantity)

    if (isNaN(data.quantity)) {
      return {
        success: false,
        error: new zod.ZodError([
          {
            code: "invalid_type",
            expected: "number",
            received: "string",
            path: ["quantity"],
            message: "Expected number, received string",
          },
        ]),
      }
    }
  }
  if (typeof data.subtotal === "string") {
    data.subtotal = Number(data.subtotal)

    if (isNaN(data.subtotal)) {
      return {
        success: false,
        error: new zod.ZodError([
          {
            code: "invalid_type",
            expected: "number",
            received: "string",
            path: ["subtotal"],
            message: "Expected number, received string",
          },
        ]),
      }
    }
  }

  return orderSchema.safeParse(data)
}
