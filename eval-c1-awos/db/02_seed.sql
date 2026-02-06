INSERT INTO status (id, name) VALUES 
(1,'pendiente'), (2,'completado'), (3,'cancelado');

INSERT INTO p_methods (id, name) VALUES 
(1,'efectivo'), (2,'tarjeta'), (3,'transferencia');

INSERT INTO customers (name, email) VALUES 
('Alicia', 'alicia@email.com'),
('Antonio', 'the_tito@email.com'),
('Nadia ', 'naddilu@email.com'),
('Antonio De Hoyos', 'toniboni@email.com'),
('Carlos', 'charly@email.com'),
('Emma', 'emma-prec@email.com'),
('Luis Angel', 'ngen_luis@email.com'),
('Viviana', 'profe-laAmo@email.com'),
('Diego ', 'diego-zarate@email.com'),
('Isaac', 'isaac-mendoza@email.com'),
('Brian', 'brian@email.com'),
('Nestor', 'nestor@email.com')
;

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
(15, 'Club sándwich', 5, 80, true),
(16, 'Milanesa de pollo', 6, 40, true),
(17, 'Albondigas', 6, 70, true),
(18, 'Caldo de pollo', 6, 60, true);


INSERT INTO orders (id_customer, created_at, status) VALUES
(1, CURRENT_DATE - 60, 2), 
(2, CURRENT_DATE - 59, 1),
(5, CURRENT_DATE - 58, 3),
(1, CURRENT_DATE - 57, 3), 
(3, CURRENT_DATE - 56, 2),
(8, CURRENT_DATE - 55, 1), 
(4, CURRENT_DATE - 54, 2),
(2, CURRENT_DATE - 53, 2), 
(6, CURRENT_DATE - 52, 2),
(1, CURRENT_DATE - 51, 2),
(7,  CURRENT_DATE - 50, 1),
(2, CURRENT_DATE - 49, 2), 
(8, CURRENT_DATE - 48, 3), 
(1, CURRENT_DATE - 47, 3), -- Alicia
(11, CURRENT_DATE - 46, 1), 
(12, CURRENT_DATE - 45, 2),
(3, CURRENT_DATE - 44, 2),
(12, CURRENT_DATE - 43, 2),
(8, CURRENT_DATE - 42, 2), 
(2, CURRENT_DATE - 41, 2), 
(4,  CURRENT_DATE - 40, 2),
(1, CURRENT_DATE - 39, 2), -- Alicia
(5, CURRENT_DATE - 38, 1),
(8, CURRENT_DATE - 37, 2), -- Viviana
(6, CURRENT_DATE - 36, 2),
(2, CURRENT_DATE - 35, 2),
(7, CURRENT_DATE - 34, 1),
(12, CURRENT_DATE - 33, 1),
(1, CURRENT_DATE - 32, 2), -- Alicia
(11, CURRENT_DATE - 31, 3),
(10, CURRENT_DATE - 30, 2),
(8, CURRENT_DATE - 29, 1), 
(9, CURRENT_DATE - 28, 2),
(2, CURRENT_DATE - 27, 3), 
(8, CURRENT_DATE - 26, 2),
(7, CURRENT_DATE - 25, 2),
(1, CURRENT_DATE - 24, 1), -- Alicia
(6, CURRENT_DATE - 23, 2),
(5, CURRENT_DATE - 22, 2),
(8, CURRENT_DATE - 21, 2), -- Viviana
(4, CURRENT_DATE - 20, 2),
(1, CURRENT_DATE - 19, 2), 
(4, CURRENT_DATE - 18, 2),
(8, CURRENT_DATE - 17, 2), 
(3, CURRENT_DATE - 16, 3),
(2, CURRENT_DATE - 15, 2),
(5, CURRENT_DATE - 14, 2),
(6, CURRENT_DATE - 13, 2),
(1, CURRENT_DATE - 12, 2), 
(7, CURRENT_DATE - 11, 2),
(8, CURRENT_DATE - 10, 2),
(8, CURRENT_DATE - 9, 2),
(9, CURRENT_DATE - 8, 2),
(2, CURRENT_DATE - 7, 3),
(10, CURRENT_DATE - 6, 1),
(11, CURRENT_DATE - 5, 2),
(1, CURRENT_DATE - 4, 1),
(12, CURRENT_DATE - 3, 2),
(1, CURRENT_DATE - 2, 2),
(8, CURRENT_DATE - 1, 2);

INSERT INTO order_items (order_id, product_id, qty, price)
SELECT
  o.id,
  ((o.rownum % (SELECT COUNT(*) FROM products)) + 1) AS product_id,
  ((o.rownum % 5) + 1) AS qty,
  CASE (o.rownum % 4)
    WHEN 0 THEN 180
    WHEN 1 THEN 320
    WHEN 2 THEN 450
    ELSE 600
  END AS price
FROM (
  SELECT id, row_number() OVER (ORDER BY id) - 1 AS rownum
  FROM orders
  ORDER BY id
  LIMIT 60
) o;

INSERT INTO payments (order_id, method_id, amount)
SELECT
  o.id,
  ((o.id % (SELECT COUNT(*) FROM p_methods)) + 1) AS method_id,
  COALESCE((SELECT SUM(qty * price) FROM order_items WHERE order_id = o.id),
           ((o.id % 5) + 1) * 300) AS amount
FROM orders o
WHERE o.status = 2
ORDER BY random()
LIMIT 60;


