import zod from "zod";

const scheduleSchema = zod.object({
    timeFrom: zod.string().datetime(),
    estimatedTime: zod.number().int(),
    toleranceTime: zod.number().int(),
    capacityLeft: zod
    .number().int()
    .default(50),
})

export function validateSchedule(data: any) {
    return scheduleSchema.safeParse(data);
}
