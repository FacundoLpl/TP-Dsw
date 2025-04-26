import zod from "zod";

const scheduleSchema = zod.object({

    datetime: zod
    .string()
    .datetime()
    .refine((value) => {
        const date = new Date(value);
        const hour = date.getUTCHours(); 
        return hour >= 19 && hour <= 23;
      }, {
        message: "La hora debe estar entre las 19:00 y las 23:00.",
      }),
    

    estimatedTime: zod.number().int()
    .default(60),

    toleranceTime: zod.number().int()
    .default(15),

    capacityLeft: zod
    .number().int().min(0)
    .default(50),
})

export function validateSchedule(data: any) {
    return scheduleSchema.safeParse(data);
}
