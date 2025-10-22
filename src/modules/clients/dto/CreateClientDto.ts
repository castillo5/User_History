import { z } from 'zod';

export const createClientSchema = z.object({
  nombre: z.string().min(3).max(150),
  email: z.string().email(),
  telefono: z.string().min(7).max(40),
  direccion: z.string().max(255).optional()
});

export type CreateClientDto = z.infer<typeof createClientSchema>;
