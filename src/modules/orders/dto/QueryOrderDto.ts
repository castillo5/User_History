import { z } from 'zod';

export const queryOrderSchema = z.object({
  clienteId: z.string().uuid().optional(),
  productoId: z.string().uuid().optional(),
  estado: z.enum(['pendiente', 'preparando', 'entregado']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional()
});

export type QueryOrderDto = z.infer<typeof queryOrderSchema>;
