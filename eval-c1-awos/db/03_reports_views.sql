-- minimo 5 views lpm --

-- vw_sales_daiy
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

-- vw_inventory_risk
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

-- vw_customer_value
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


-- vw_top_products_ranked

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

--vw_customer_value
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

--vw_payment_mix

CREATE OR REPLACE VIEW vw_payment_mix AS
WITH payment_totals AS (
  SELECT 
    pm.id AS method_id,
    pm.name AS method_name,
    COUNT(p.id) AS transaction_count,
    COALESCE(SUM(p.amount), 0) AS total_amount
  FROM p_methods pm
  LEFT JOIN payments p ON pm.id = p.method_id
  GROUP BY pm.id, pm.name
),
grand_total AS (
  SELECT SUM(total_amount) AS overall_total
  FROM payment_totals
)
SELECT 
  pt.method_id,
  pt.method_name,
  pt.transaction_count,
  pt.total_amount,
  ROUND((pt.total_amount::numeric / NULLIF(gt.overall_total, 0)) * 100, 2) AS percentage,
  CASE 
    WHEN pt.total_amount = 0 THEN 'unused'
    WHEN (pt.total_amount::numeric / NULLIF(gt.overall_total, 0)) * 100 > 40 THEN 'dominant'
    WHEN (pt.total_amount::numeric / NULLIF(gt.overall_total, 0)) * 100 > 20 THEN 'significant'
    ELSE 'minor'
  END AS usage_category
FROM payment_totals pt
CROSS JOIN grand_total gt
ORDER BY pt.total_amount DESC;