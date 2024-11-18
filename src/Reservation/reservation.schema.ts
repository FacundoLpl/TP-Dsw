import zod from "zod";

const reservationSchema = zod.object({
  user: zod.string(),
  state: zod
    .enum(["Completed", "Pending", "Canceled"])
    .optional()
    .default("Pending")
    .refine(
      (value: string) =>
        value === "Completed" || value === "Pending" || value === "Canceled",
      { message: "State must be either Completed, Pending, or Canceled" }
    ),
  people: zod.number().min(1, { message: "People must be at least 1" }),
  datetime: zod.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), zod.date()),
});

export function validateReservation(data: any) {
  return reservationSchema.safeParse(data);
}
