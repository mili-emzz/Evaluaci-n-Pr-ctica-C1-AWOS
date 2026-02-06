export type SalesDaily = {
  sale_date: string;
  total_tickets: number;
  total_sales: number;
  avg_ticket: number;
  sales_category: 'alta' | 'media' | 'baja';
};

export type TopProduct = {
  product_id: number;
  product_name: string;
  category_name: string;
  total_revenue: number;
  units_sold: number;
  orders_count: number;
  revenue_rank: number;
  units_rank: number;
  avg_price_per_unit: number;
};

export type InventoryRisk = {
  product_id: number;
  product_name: string;
  category_name: string;
  category_id: number;
  current_stock: number;
  category_avg_stock: number;
  stock_percentage: number;
  risk_level: 'sin_stock' | 'critico' | 'advertencia' | 'normal';
};

export type CustomerValue = {
  customer_id: number;
  customer_name: string;
  customer_email: string;
  order_count: number;
  total_spent: number;
  avg_order_value: number;
  last_order_date: string;
  segment:  'preferido' | 'recurrente' | 'ocasional';
  days_since_last_order: number;
};

export type PaymentMix = {
  method_id: number;
  method_name: string;
  transaction_count: number;
  total_amount: number;
  percentage: number;
  usage_category: 'sin movimiento' | 'principal' | 'secundario' | 'alternativo';
};