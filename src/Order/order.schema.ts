import zod from "zod";

const orderSchema = zod.object({
  subtotal: zod.number(),
  product: zod.string(),
  quantity: zod.number().min(1),
  cart: zod.string().optional(),
});

export function validateOrder(data: any) {
  return orderSchema.safeParse(data);
}
