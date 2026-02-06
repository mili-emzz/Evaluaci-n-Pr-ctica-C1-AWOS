INSERT INTO status (id, name) VALUES 
(1,'pendiente'), (2,'completado'), (3,'cancelado');

INSERT INTO p_methods (id, name) VALUES 
(1,'efectivo'), (2,'tarjeta'), (3,'transferencia');

INSERT INTO customers (name, email) VALUES 
('Alicia Ocaña', 'alicia@email.com'),
('Antonio Selvas', 'the_tito@email.com'),
('Nadia Guerra', 'naddilu@email.com'),
('Antonio De Hoyos', 'toniboni@email.com'),
('Carlos Ochoa', 'charly@email.com'),
('Emma Reyes', 'emma-prec@email.com'),
('Luis Angel Perez', 'ngen_luis@email.com'),
('Viviana Rojo', 'profe-laAmo@email.com');

-- Insertar clientes generados con un ID auto-incrementado
INSERT INTO customers (name, email)
SELECT 
  'Customer ' || generate_series,
  'customer' || generate_series || '@email.com'
FROM generate_series(11, 50);

INSERT INTO categories (id, name) VALUES 
(1,'Bebidas frías'), (2,'Bebidas calientes'), (3,'Panaderia'), (4,'Postres'), (5,'Desayunos'), (6,'Comidas');

INSERT INTO products (id, name, category_id, stock, active) VALUES 
(1, 'Coca Cola', 1, 9, true),
(2, 'Limonada', 1, 20, true),
(3, 'Agua mineral', 1, 300, true),
(4, 'Espresso', 2, 1, true),
(5, 'Cappuccino', 2, 80, true),
(6, 'Latte', 2, 90, true),
(7, 'Crossaint', 3, 60, true),
(8, 'Muffin', 3, 50, true),
(9, 'Brownie', 4, 30, true),
(10, 'Cheesecake', 4, 10, true),
(11, 'Pastel de chocolate', 4, 15, true),
(12, 'Pan de elote', 4, 25, true),
(13, 'Huevos rancheros', 5, 20, true),
(14, 'Chilaquiles con pollo', 5, 90, true),
(15, 'Ckub sándwich', 5, 80, true),
(16, 'Milanesa de pollo', 6, 40, true),
(17, 'Albondigas', 6, 70, true),
(18, 'Caldo de pollo', 6, 60, true);



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
