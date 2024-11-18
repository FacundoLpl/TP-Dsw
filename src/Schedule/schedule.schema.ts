import zod from "zod";

const scheduleSchema = zod.object({

    datetime: zod.string().datetime(),

    estimatedTime: zod.number().int()
    .default(60),

    toleranceTime: zod.number().int()
    .default(15),

    capacityLeft: zod
    .number().int()
    .default(50),
})

export function validateSchedule(data: any) {
    return scheduleSchema.safeParse(data);
}
