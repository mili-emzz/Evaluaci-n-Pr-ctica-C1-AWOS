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
