import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  estado: z.enum(['pendiente', 'preparando', 'entregado'])
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
