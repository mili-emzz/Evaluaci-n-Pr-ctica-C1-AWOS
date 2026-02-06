-- View 1: vw_sales_daily
-- Descripción: Ventas diarias agregadas con métricas clave
-- Grain: 1 fila por día
-- Métricas: total_ventas, tickets, ticket_promedio
-- Características: GROUP BY, agregados (SUM, COUNT, AVG), campo calculado
-- Verify:
-- SELECT * FROM vw_sales_daily WHERE sale_date >= '2024-11-01' ORDER BY sale_date DESC LIMIT 10;
-- SELECT * FROM vw_sales_daily WHERE sale_date BETWEEN '2024-12-01' AND '2024-12-31';

CREATE OR REPLACE VIEW vw_sales_daily AS
SELECT 
  DATE(o.created_at) AS sale_date,
  COUNT(DISTINCT o.id) AS total_tickets,
  SUM(p.amount) AS total_sales,
  ROUND(AVG(p.amount), 2) AS avg_ticket,
  CASE 
    WHEN SUM(p.amount) > 50000 THEN 'high'
    WHEN SUM(p.amount) > 20000 THEN 'medium'
    ELSE 'low'
  END AS sales_category
FROM orders o
INNER JOIN payments p ON o.id = p.order_id
WHERE o.status = 2
GROUP BY DATE(o.created_at)
HAVING SUM(p.amount) > 0
ORDER BY sale_date DESC;

-- View 2: vw_inventory_risk
-- Descripción: Productos con stock bajo agrupados por categoría
-- Grain: 1 fila por producto en riesgo
-- Métricas: stock_level, risk_percentage, category_avg_stock
-- Características: CASE, COALESCE, Window Function, GROUP BY
-- Verify:
-- SELECT * FROM vw_inventory_risk WHERE risk_level = 'critical';
-- SELECT * FROM vw_inventory_risk WHERE category_id = 1;

CREATE OR REPLACE VIEW vw_inventory_risk AS
WITH category_stats AS (
  SELECT 
    category_id,
    AVG(stock) AS avg_stock,
    MAX(stock) AS max_stock
  FROM products
  WHERE active = true
  GROUP BY category_id
)
SELECT 
  p.id AS product_id,
  p.name AS product_name,
  c.name AS category_name,
  p.category_id,
  p.stock AS current_stock,
  COALESCE(cs.avg_stock, 0) AS category_avg_stock,
  ROUND((p.stock::numeric / NULLIF(cs.avg_stock, 0)) * 100, 2) AS stock_percentage,
  CASE 
    WHEN p.stock = 0 THEN 'sin_stock'
    WHEN p.stock <= 5 THEN 'critico'
    WHEN p.stock <= 10 THEN 'advertencia'
    ELSE 'normal'
  END AS risk_level
FROM products p
INNER JOIN categories c ON p.category_id = c.id
LEFT JOIN category_stats cs ON p.category_id = cs.category_id
WHERE p.active = true AND p.stock <= 20;

-- View 3: vw_customer_value
-- Descripción: Valor total por cliente con segmentación
-- Grain: 1 fila por cliente
-- Métricas: total_spent, order_count, avg_order_value
-- Características: CTE, GROUP BY, HAVING, CASE para segmentación
-- Verify:
-- SELECT * FROM vw_customer_value ORDER BY total_spent DESC LIMIT 20;
-- SELECT segment, COUNT(*) FROM vw_customer_value GROUP BY segment;

CREATE OR REPLACE VIEW vw_customer_value AS
WITH customer_orders AS (
  SELECT 
    c.id AS customer_id,
    c.name AS customer_name,
    c.email AS customer_email,
    COUNT(DISTINCT o.id) AS order_count,
    SUM(p.amount) AS total_spent,
    MAX(o.created_at) AS last_order_date
  FROM customers c
  INNER JOIN orders o ON c.id = o.id_customer
  INNER JOIN payments p ON o.id = p.order_id
  WHERE o.status = 2
  GROUP BY c.id, c.name, c.email
)
SELECT 
  customer_id,
  customer_name,
  customer_email,
  order_count,
  total_spent,
  ROUND(total_spent::numeric / NULLIF(order_count, 0), 2) AS avg_order_value,
  last_order_date,
  CASE 
    WHEN total_spent >= 1000 THEN 'preferido'
    WHEN total_spent >= 500 THEN 'recurrente'
    ELSE 'ocasional'
  END AS segment,
  CURRENT_DATE - last_order_date AS days_since_last_order
FROM customer_orders
WHERE total_spent > 0
ORDER BY total_spent DESC;

-- View 4: vw_top_products_ranked
-- Descripción: Ranking de productos por revenue y unidades vendidas
-- Grain: 1 fila por producto
-- Métricas: total_revenue, units_sold, ranking
-- Características: Window Function (RANK), GROUP BY, campo calculado
-- Verify:
-- SELECT * FROM vw_top_products_ranked WHERE product_name LIKE '%coffee%' LIMIT 10;
-- SELECT * FROM vw_top_products_ranked ORDER BY revenue_rank LIMIT 20;

CREATE OR REPLACE VIEW vw_top_products_ranked AS
 WITH product_sales AS (
         SELECT p.id AS product_id,
            p.name AS product_name,
            c.name AS category_name,
            sum(oi.qty * oi.price) AS total_revenue,
            sum(oi.qty) AS units_sold,
            count(DISTINCT oi.order_id) AS orders_count
           FROM products p
             JOIN order_items oi ON p.id = oi.product_id
             JOIN categories c ON p.category_id = c.id
          GROUP BY p.id, p.name, c.name
         HAVING sum(oi.qty) > 0
        )
 SELECT product_id,
    product_name,
    category_name,
    total_revenue,
    units_sold,
    orders_count,
    rank() OVER (ORDER BY total_revenue DESC) AS revenue_rank,
    rank() OVER (ORDER BY units_sold DESC) AS units_rank,
    round(total_revenue::numeric / NULLIF(units_sold, 0)::numeric, 2) AS avg_price_per_unit
   FROM product_sales;

-- View 5: vw_customer_value
-- Descripción: Valor total por cliente con segmentación
-- Grain: 1 fila por cliente
-- Métricas: total_spent, order_count, avg_order_value
-- Características: CTE, GROUP BY, HAVING, CASE para segmentación
-- Verify:
-- SELECT * FROM vw_customer_value ORDER BY total_spent DESC LIMIT 20;
-- SELECT segment, COUNT(*) FROM vw_customer_value GROUP BY segment;

CREATE OR REPLACE VIEW vw_customer_value AS
 WITH customer_orders AS (
         SELECT c.id AS customer_id,
            c.name AS customer_name,
            c.email AS customer_email,
            count(DISTINCT o.id) AS order_count,
            sum(p.amount) AS total_spent,
            max(o.created_at) AS last_order_date
           FROM customers c
             JOIN orders o ON c.id = o.id_customer
             JOIN payments p ON o.id = p.order_id
          WHERE o.status = 2
          GROUP BY c.id, c.name, c.email
        )
 SELECT customer_id,
    customer_name,
    customer_email,
    order_count,
    total_spent,
    round(total_spent::numeric / NULLIF(order_count, 0)::numeric, 2) AS avg_order_value,
    last_order_date,
        CASE
            WHEN total_spent >= 1000 THEN 'preferido'::text
            WHEN total_spent >= 500 THEN 'recurrente'::text
            ELSE 'ocasional'::text
        END AS segment,
    CURRENT_DATE - last_order_date AS days_since_last_order
   FROM customer_orders
  WHERE total_spent > 0
  ORDER BY total_spent DESC;

-- View 6: vw_payment_mix
-- Descripción: Distribución de métodos de pago con análisis de tendencias
-- Grain: 1 fila por método de pago
-- Métricas: transacciones, monto total, porcentaje, ranking por volumen
-- Características: GROUP BY, agregados, window function (RANK), CASE para categorización
-- Verify:
-- SELECT * FROM vw_payment_mix ORDER BY rank_by_amount;
-- SELECT SUM(percentage) FROM vw_payment_mix; -- Debería ser aproximadamente 100%

CREATE OR REPLACE VIEW vw_payment_mix AS
WITH payment_totals AS (
  SELECT 
    pm.id AS method_id,
    pm.name AS method_name,
    COUNT(DISTINCT p.id) AS transaction_count,
    COUNT(DISTINCT p.order_id) AS orders_processed,
    COALESCE(SUM(p.amount), 0) AS total_amount,
    COALESCE(AVG(p.amount), 0) AS avg_transaction
  FROM p_methods pm
  LEFT JOIN payments p ON pm.id = p.method_id
  GROUP BY pm.id, pm.name
),
totals AS (
  SELECT SUM(total_amount) AS overall_total FROM payment_totals
)
SELECT 
  pt.method_id,
  pt.method_name,
  pt.transaction_count,
  pt.orders_processed,
  pt.total_amount,
  ROUND(pt.avg_transaction, 2) AS avg_transaction,
  ROUND((pt.total_amount::numeric / NULLIF(t.overall_total, 0)) * 100, 2) AS percentage,
  RANK() OVER (ORDER BY pt.total_amount DESC) AS rank_by_amount,
  RANK() OVER (ORDER BY pt.transaction_count DESC) AS rank_by_frequency,
  CASE 
    WHEN pt.total_amount = 0 THEN 'sin movimiento'
    WHEN (pt.total_amount::numeric / NULLIF(t.overall_total, 0)) > 0.4 THEN 'principal'
    WHEN (pt.total_amount::numeric / NULLIF(t.overall_total, 0)) > 0.2 THEN 'secundario'
    ELSE 'método alternativo'
  END AS preference_level
FROM payment_totals pt
CROSS JOIN totals t
ORDER BY pt.total_amount DESC;