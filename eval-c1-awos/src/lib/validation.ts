import { z } from 'zod';

export const productSearchSchema = z.object({
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(5).max(100).default(20),
});

export type ProductSearchParams = z.infer<typeof productSearchSchema>;

export const salesDailySchema = z.object({
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type SalesDailyParams = z.infer<typeof salesDailySchema>;

export const inventoryRiskSchema = z.object({
  category_id: z.coerce.number().int().min(1).max(10).optional(),
});

export type InventoryRiskParams = z.infer<typeof inventoryRiskSchema>;

export const customerValueSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(5).max(100).default(20),
});

export type CustomerValueParams = z.infer<typeof customerValueSchema>;