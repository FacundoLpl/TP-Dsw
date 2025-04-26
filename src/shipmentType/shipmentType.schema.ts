import zod from "zod";

const shipmentTypeSchema = zod.object({
    estimatedTime: zod.number().int().min(0),
    type: zod.string().min(0),

})

export function validateshipmentType(data: any) {
    return shipmentTypeSchema.safeParse(data);
}
