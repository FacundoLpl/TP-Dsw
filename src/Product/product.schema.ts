import zod from "zod";

const productSchema = zod.object({
  name: zod.string().min(4, "name must be at least 4 letters"),
  description: zod.string().min(10),
  price: zod.number().min(1),
  stock: zod.number().int().min(0, { message: "Stock must be a positive number" }),
  imageUrl: zod.string(),
  state: zod
    .enum(["Archived", "Active"])
    .optional()
    .default("Active")
    .refine((value: string) => value === "Active" || value === "Archived", {
      message: "State must be either Active or Archived",
    }),
  category: zod.string(),
});
export function validateProduct(data: any) {
  return productSchema.safeParse(data);
}
