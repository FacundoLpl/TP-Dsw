import zod from "zod";

const shipmentTypeSchema = zod.object({
    estimatedTime: zod.number().int(),
    type: zod.string().min(5),

})

export function validateshipmentType(data: any) {
    return shipmentTypeSchema.safeParse(data);
}
