INSERT INTO status (name) VALUES 
('pendiente'), ('completado'), ('cancelado');

INSERT INTO p_methods (name) VALUES 
('efectivo'), ('tarjeta'), ('transferencia'), ('cacao');

INSERT INTO customers (name, email) VALUES 
('Alicia Ocaña', 'alicia@email.com'),
('Antonio Selvas', 'the_tito@email.com'),
('Nadia Guerra', 'naddilu@email.com'),
('Antonio De Hoyos', 'toniboni@email.com'),
('Carlos Ochoa', 'charly@email.com'),
('Emma Reyes', 'emma-prec@email.com'),
('Luis Angel Perez', 'ngen_luis@email.com'),
('Viviana Rojo', 'profe-laAmo@email.com');

INSERT INTO customers (name, email)
SELECT 
  'Customer ' || generate_series,
  'customer' || generate_series || '@email.com'
FROM generate_series(11, 50);

INSERT INTO categories (name) VALUES 
('Bebidas frías'), ('Bebidas calientes'), ('Panaderia'), ('Postres'), ('Desayunos'), ('Comidas');

INSERT INTO products (name, category_id, stock, active) VALUES 

('Coca Cola', 1, 9, true),
('Limonada', 1, 20, true),
('Agua mineral', 1, 300, true),

('Espresso', 2, 1, true),
('Cappuccino', 2, 80, true),
('Latte', 2, 90, true),

('Crossaint', 3, 60, true),
('Muffin', 3, 50, true),
('Brownie', 4, 30, true),

('Cheesecake', 4, 10, true),
('Pastel de chocolate', 4, 15, true),
('Pan de elote', 4, 25, true),

('Huevos rancheros', 5, 20, true),
('Chilaquiles con pollo', 5, 90, true),
('Ckub sándwich', 5, 80, true),

('Milanea de pollo', 6, 40, true),
('Albondigas', 6, 70, true),
('Caldo de pollo', 6, 60, true); 

INSERT INTO orders (id_customer, created_at, status)
SELECT 
  (random() * 49 + 1)::int AS id_customer,
  CURRENT_DATE - (random() * 90)::int AS created_at,
  CASE WHEN random() < 0.8 THEN 2 ELSE 1 END AS status
FROM generate_series(1, 300);

INSERT INTO order_items (order_id, product_id, qty, price)
SELECT 
  o.id,
  (random() * 13 + 1)::int AS product_id,
  (random() * 3 + 1)::int AS qty,
  CASE 
    WHEN random() < 0.3 THEN 250
    WHEN random() < 0.6 THEN 350
    WHEN random() < 0.9 THEN 450
    ELSE 550
  END AS price
FROM orders o
CROSS JOIN generate_series(1, (random() * 2 + 1)::int);

INSERT INTO payments (order_id, method_id, amount)
SELECT 
  o.id,
  (random() * 3 + 1)::int AS method_id,
  (SELECT SUM(qty * price) FROM order_items WHERE order_id = o.id) AS amount
FROM orders o
WHERE o.status = 2;