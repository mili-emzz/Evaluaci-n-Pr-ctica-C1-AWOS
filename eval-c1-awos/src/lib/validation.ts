import { z } from 'zod';

const singleDate = z.preprocess((val) => {
  if (Array.isArray(val)) return val[0];
  return val;
}, z.string().optional());

export const salesDailySchema = z
  .object({
    date_from: singleDate,
    date_to: singleDate,
  })
  .strict();

export const topProductsSchema = z
  .object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  });

export const inventoryRiskSchema = z
  .object({
    category_id: z
      .preprocess((v) => {
        if (Array.isArray(v)) return v[0];
        return v;
      }, z.coerce.number().int().optional()),
  })
  .strict();


export const customerValueSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  });

export const paymentMixSchema = z.object({}).strict();

export type SalesDailyQuery = z.infer<typeof salesDailySchema>;
export type TopProductsQuery = z.infer<typeof topProductsSchema>;
export type InventoryRiskQuery = z.infer<typeof inventoryRiskSchema>;
export type CustomerValueQuery = z.infer<typeof customerValueSchema>;
export type PaymentMixQuery = z.infer<typeof paymentMixSchema>;