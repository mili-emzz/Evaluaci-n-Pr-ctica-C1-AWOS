import { z } from 'zod';

const singleDate = z.preprocess((val) => {
  if (Array.isArray(val)) return val[0];
  return val;
}, z.string().optional());

export const salesDailySchema = z.object({
  date_from: singleDate,
  date_to: singleDate,
});

export const topProductsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const VALID_CATEGORIES = [1, 2, 3, 4, 5, 6] as const;
export const inventoryRiskSchema = z.object({
  category_id: z.coerce.number().int().refine(
    (val) => VALID_CATEGORIES.includes(val as typeof VALID_CATEGORIES[number]),
    { message: 'Categoría inválida' }
  ).optional(),
});

// Paginación para vw_customer_value
export const customerValueSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});