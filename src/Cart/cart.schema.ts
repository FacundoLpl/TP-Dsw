import zod from "zod";

const cartSchema = zod.object({
  user: zod.string(),
  state: zod
    .enum(["Completed", "Pending", "Canceled"])
    .optional()
    .default("Pending")
    .refine(
      (value: string) =>
        value === "Completed" || value === "Pending" || value === "Canceled",
      { message: "State must be either Complete, Pending or Canceled" }
    ),
  total: zod.number().min(0, { message: "Total must be a positive number" }),
  shipmentType: zod.string().optional(),
});

export function validateCart(data: any) {
  return cartSchema.safeParse(data);
}
