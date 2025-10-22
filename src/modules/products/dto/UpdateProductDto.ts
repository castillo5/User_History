import { z } from 'zod';

export const updateProductSchema = z
  .object({
    nombre: z.string().min(3).max(150).optional(),
    codigo: z.string().min(3).max(100).optional(),
    precio: z.coerce.number().positive().optional(),
    categoria: z.string().min(2).max(120).optional(),
    stock: z.coerce.number().int().nonnegative().optional()
  })
  .strict();

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
