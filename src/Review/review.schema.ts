import zod from 'zod';

const reviewSchema = zod.object({
  product: zod.string(),
  comment: zod.string().max(2000),
  rating: zod.number().min(1).max(5),
  state: zod
    .enum(['Archived', 'Active'])
    .optional()
    .default('Active')
    .refine((value: string) => value === 'Active' || value === 'Archived', {
      message: 'State must be either Active or Archived',
    }),
});

export function validateReview(data: any) {
  return reviewSchema.safeParse(data);
}
