import { z } from 'zod';

export const registerSchema = z.object({
  nombre: z.string().min(3).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(64),
  rol: z.enum(['admin', 'vendedor']).default('vendedor')
});

export type RegisterDto = z.infer<typeof registerSchema>;
