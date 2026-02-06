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

