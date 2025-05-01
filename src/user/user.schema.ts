import zod from "zod";

const userSchema = zod.object({
  firstName: zod.string().min(5),
  dni: zod.string().min(8, "DNI should have 8 characters").max(8, "DNI should have 8 characters"),
  lastName: zod.string().min(5),
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod.string().min(8),
  address: zod.string(),

  userType: zod
  .enum(["Admin", "Client"])
  .default("Client")
  .refine((value: string) => value === "Client" || value === "Admin", {
    message: "Type must be either Client or Admin",
  }),
  state: zod
    .enum(["Archived", "Active"])
    .default("Active")
    .refine((value: string) => value === "Active" || value === "Archived", {
      message: "State must be either Active or Archived",
    }),
});

export function validateUser(data: any) {
  const result = userSchema.safeParse(data); // Validate using zod schema
    if (result.success) {
        return { success: true, data: result.data };
    } else {
        return { success: false, error: result.error };
    }}