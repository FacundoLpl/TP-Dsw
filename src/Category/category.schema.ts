import zod from "zod";

const categorySchema = zod.object({
  name: zod
    .string()
    .min(4, { message: "Category name must be at least 4 characters long" })
    .refine((value) => value.trim().length > 0, {
      message: "category name can not be empty or contain only spaces",
    }),

});

export function validateCategory(data: any) {
  return categorySchema.safeParse(data);
}