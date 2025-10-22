import { z } from 'zod';

export const updateClientSchema = z
  .object({
    nombre: z.string().min(3).max(150).optional(),
    email: z.string().email().optional(),
    telefono: z.string().min(7).max(40).optional(),
    direccion: z.string().max(255).optional()
  })
  .strict();

export type UpdateClientDto = z.infer<typeof updateClientSchema>;
