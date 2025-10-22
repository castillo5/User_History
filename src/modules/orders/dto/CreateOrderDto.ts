import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().positive()
});

export const createOrderSchema = z.object({
  clienteId: z.string().uuid(),
  estado: z.enum(['pendiente', 'preparando', 'entregado']).optional(),
  items: z.array(orderItemSchema).min(1),
  sensitiveData: z
    .object({
      notasInternas: z.string().max(500).optional(),
      pagoReferencia: z.string().max(120).optional()
    })
    .optional()
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
