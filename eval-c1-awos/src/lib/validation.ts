import { z } from 'zod';

export const createOrderSchema = z.object({
  id_customer: z.number().int().min(1, "Cliente inválido"),
  items: z.array(
    z.object({
      product_id: z.number().int().min(1),
      qty: z.number().int().min(1),
      price: z.number().positive(),
    })
  ).min(1, "Al menos 1 item requerido"),
  status: z.number().int().min(1).max(3),
});

export const createPaymentSchema = z.object({
  order_id: z.number().int().min(1),
  method_id: z.number().int().min(1).max(3),
  amount: z.number().positive("Monto debe ser positivo"),
});

export const createProductSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres").max(100),
  category_id: z.number().int().min(1),
  stock: z.number().int().min(0),
  active: z.boolean().default(true),
});

export const createCustomerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(40),
  email: z.string().email("Email inválido"),
});

// TIPOS DERIVADOS DE SCHEMAS (para usar en funciones)

export type CreateOrder = z.infer<typeof createOrderSchema>;
export type CreatePayment = z.infer<typeof createPaymentSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type CreateCustomer = z.infer<typeof createCustomerSchema>;

