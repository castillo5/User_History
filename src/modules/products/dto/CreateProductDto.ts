import { z } from 'zod';

export const createProductSchema = z.object({
  nombre: z.string().min(3).max(150),
  codigo: z.string().min(3).max(100),
  precio: z.coerce.number().positive(),
  categoria: z.string().min(2).max(120),
  stock: z.coerce.number().int().nonnegative()
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
