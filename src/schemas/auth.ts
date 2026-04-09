import { z } from 'zod';

export const AdminLoginSchema = z.object({
  username: z
    .string()
    .min(1, 'Usuário é obrigatório')
    .max(50, 'Usuário muito longo'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .max(255, 'Senha muito longa'),
});

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
