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
('Sofia ', 'sofia-marquez@email.com'),
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
(15, 'Ckub sándwich', 5, 80, true),
(16, 'Milanesa de pollo', 6, 40, true),
(17, 'Albondigas', 6, 70, true),
(18, 'Caldo de pollo', 6, 60, true);

