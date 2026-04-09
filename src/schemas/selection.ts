import { z } from 'zod';

export const SubmitSelectionSchema = z.object({
  matricula: z
    .string()
    .min(12, 'Matrícula deve ter 12 dígitos')
    .max(12, 'Matrícula deve ter 12 dígitos')
    .regex(/^\d{12}$/, 'Matrícula deve conter apenas números'),
  mainAreaId: z
    .number()
    .int('Área principal deve ser um número inteiro')
    .min(1, 'Selecione uma área principal válida')
    .max(5, 'Área principal inválida'),
  areaPreferenceOrder: z
    .array(z.number().int().min(1).max(5))
    .length(4, 'Deve selecionar exatamente 4 áreas para o ranking'),
  articlesSelected: z
    .record(z.string().min(1), z.string().min(1))
    .refine(
      (obj) => Object.keys(obj).length >= 1,
      'Deve selecionar pelo menos um artigo'
    ),
  customPdfIncluded: z.boolean().optional(),
});

export type SubmitSelectionInput = z.infer<typeof SubmitSelectionSchema>;

export const ValidateMatriculaSchema = z.object({
  matricula: z
    .string()
    .min(12, 'Matrícula deve ter 12 dígitos')
    .max(12, 'Matrícula deve ter 12 dígitos')
    .regex(/^\d{12}$/, 'Matrícula deve conter apenas números'),
});

export type ValidateMatriculaInput = z.infer<typeof ValidateMatriculaSchema>;
