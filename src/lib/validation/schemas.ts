import { z } from 'zod';

export const winePrivacySchema = z.enum(['private', 'shared', 'public']);

export const createWineEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  vintage: z.number().int().min(1900).max(new Date().getFullYear() + 1).nullable().optional(),
  producer: z.string().max(200).optional().default(''),
  region: z.string().max(200).optional().default(''),
  grapes: z.array(z.string().max(100)).max(20).optional().default([]),
  purchaseDate: z.string().nullable().optional(),
  price: z.number().min(0).max(100000).nullable().optional(),
  location: z.string().max(200).optional().default(''),
  notes: z.string().max(10000).optional().default(''),
  rating: z.number().min(0.5).max(5).multipleOf(0.5),
  tags: z.array(z.string().max(50)).max(30).optional().default([]),
  privacy: winePrivacySchema.optional().default('private'),
});

export const updateWineEntrySchema = createWineEntrySchema.partial();

export const wineFiltersSchema = z.object({
  search: z.string().optional(),
  tags: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxRating: z.coerce.number().min(0).max(5).optional(),
  region: z.string().optional(),
  grape: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'highest-rated', 'lowest-rated']).optional(),
});

export type CreateWineEntryInput = z.infer<typeof createWineEntrySchema>;
export type CreateWineEntryFormValues = z.input<typeof createWineEntrySchema>;
export type UpdateWineEntryInput = z.infer<typeof updateWineEntrySchema>;
