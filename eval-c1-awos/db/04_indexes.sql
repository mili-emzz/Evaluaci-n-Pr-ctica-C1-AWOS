
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_payments_order_id ON payments(order_id);

CREATE INDEX idx_orders_customer_status ON orders(id_customer, status);