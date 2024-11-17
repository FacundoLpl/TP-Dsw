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
      { message: "State must be either Complete, Pending or Canceled" }
    ),
  people: zod.number().min(0, { message: "Total must be a positive number" }),
  datetime: zod.date(),
});

export function validateReservation(data: any) {
  return reservationSchema.safeParse(data);
}