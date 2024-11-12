import zod from "zod";

const scheduleSchema = zod.object({
  firstName: zod.string().min(5),

  lastName: zod.string().min(5),

  email: zod.string().email({ message: "Invalid email address" }),
  password: zod.string().min(8),
  address: zod.string(),

  userType: zod.string().min(5),
  state: zod
    .enum(["Archived", "Active"])
    .default("Active")
    .refine((value: string) => value === "Active" || value === "Archived", {
      message: "State must be either Active or Archived",
    }),
});

export function validateUser(data: any) {
  return userSchema.safeParse(data);
}
