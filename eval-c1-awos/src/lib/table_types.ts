export type Customer = {
  id: number;
  name: string;
  email: string;
};

export type Product = {
  id: number;
  name: string;
  category_id: number;
  stock: number;
  active: boolean;
};

export type Order = {
  id: number;
  id_customer: number;
  created_at: string;
  status: 1 | 2 | 3; 
};

export type Payment = {
  id: number;
  order_id: number;
  method_id: number;
  amount: number;
};