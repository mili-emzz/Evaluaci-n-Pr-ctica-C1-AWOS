# Evaluacion Cafeteria Campus

## Descripción proyecto

Proyecto para evaluación de la unidad 1 de awos.
## Escenario
Eres responsable de analitica en una cafeteria del campus. No necesitan un punto de venta completo, sino un dashboard de reportes para entender ventas, productos estrella, inventario en riesgo, clientes frecuentes y mezcla de pagos. Tu app debe permitir consultar estos insights con filtros y paginación.

## 🔐 Verificación de Seguridad

### Verificación Manual
```bash
# 1. Conectarse como app_user
docker exec -it evalc1_db  psql -U app_user -d evalc1_db -c "SELECT * FROM customers LIMIT 1";

# 2. Probar acceso a VIEWS (✅ debe funcionar)
SELECT * FROM vw_sales_daily LIMIT 3;

# 3. Probar acceso a TABLAS (❌ debe fallar)
SELECT * FROM customers LIMIT 1;
-- Resultado esperado: ERROR: permission denied for table customers

### Resultado Esperado

✅ **app_user puede:**
- Leer datos de las 5 VIEWS

❌ **app_user NO puede:**
- Leer tablas directamente
- Insertar datos
- Actualizar datos
- Eliminar datos
- Crear/modificar estructura de BD

Esto garantiza que incluso si la aplicación es comprometida, el atacante solo puede leer datos agregados de las VIEWS, no acceder a datos sensibles de las tablas ni modificar la base de datos.
```
---

## 📊 Índices y Optimización de Queries

### Índices Creados

Se crearon 6 índices estratégicos para optimizar las queries más frecuentes:
```sql
-- 1. Filtrado por fecha en orders
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- 2. Join order_items -> products
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- 3. Filtrado por categoría y stock en products
CREATE INDEX idx_products_category_stock ON products(category_id, stock) WHERE active = true;

-- 4. Join payments -> orders
CREATE INDEX idx_payments_order_id ON payments(order_id);

-- 5. Búsqueda de texto en products (GIN index)
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);

-- 6. Join orders -> customers con filtro de status
CREATE INDEX idx_orders_customer_status ON orders(id_customer, status);
```

---

## 📖 Indices

### Ejecutar query con EXPLAIN directamente
`docker exec -it evalc1_db psql -U postgres -d evalc1_db -c "EXPLAIN ANALYZE SELECT * FROM vw_sales_daily WHERE sale_date >= '2026-01-01';"`

### Evidencia con EXPLAIN ANALYZE

#### **Query 1: Ventas Diarias con Filtro de Fecha**

**Query:**
```sql
EXPLAIN ANALYZE
SELECT 
  DATE(o.created_at) AS sale_date,
  COUNT(DISTINCT o.id) AS total_tickets,
  SUM(p.amount) AS total_sales
FROM orders o
INNER JOIN payments p ON o.id = p.order_id
WHERE o.created_at >= '2026-01-01' 
  AND o.created_at <= '2026-02-06'
  AND o.status = 2
GROUP BY DATE(o.created_at);
```

**Resultado:**
```
                                                              QUERY PLAN
---------------------------------------------------------------------------------------------------------------------------------------
 HashAggregate  (cost=45.23..47.23 rows=200 width=40) (actual time=2.456..2.678 rows=37 loops=1)
   Group Key: (DATE(o.created_at))
   ->  Hash Join  (cost=12.45..38.21 rows=703 width=12) (actual time=0.234..1.890 rows=245 loops=1)
         Hash Cond: (p.order_id = o.id)
         ->  Seq Scan on payments p  (cost=0.00..18.50 rows=850 width=8) (actual time=0.012..0.234 rows=850 loops=1)
         ->  Hash  (cost=10.00..10.00 rows=196 width=8) (actual time=0.189..0.190 rows=245 loops=1)
               Buckets: 1024  Batches: 1  Memory Usage: 18kB
               ->  Index Scan using idx_orders_created_at on orders o  (cost=0.15..10.00 rows=196 width=8) (actual time=0.023..0.134 rows=245 loops=1)
                     Index Cond: ((created_at >= '2026-01-01'::timestamp) AND (created_at <= '2026-02-06'::timestamp))
                     Filter: (status = 2)
                     Rows Removed by Filter: 35
 Planning Time: 0.456 ms
 Execution Time: 2.789 ms
```
- **Índice usado:** `idx_orders_created_at` (línea 8)

---

#### **Query 2: Top Productos con Join**

**Query:**
```sql
EXPLAIN ANALYZE
SELECT 
  p.name AS product_name,
  SUM(oi.qty * oi.price) AS total_revenue,
  SUM(oi.qty) AS units_sold
FROM products p
INNER JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_revenue DESC
LIMIT 10;
```

**Resultado:**
```
                                                                 QUERY PLAN
---------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=89.45..89.48 rows=10 width=120) (actual time=4.234..4.237 rows=10 loops=1)
   ->  Sort  (cost=89.45..90.20 rows=300 width=120) (actual time=4.232..4.234 rows=10 loops=1)
         Sort Key: (sum((oi.qty * oi.price))) DESC
         Sort Method: top-N heapsort  Memory: 26kB
         ->  HashAggregate  (cost=78.50..83.50 rows=300 width=120) (actual time=3.890..4.012 rows=18 loops=1)
               Group Key: p.id, p.name
               ->  Hash Join  (cost=15.25..65.00 rows=900 width=120) (actual time=0.345..2.567 rows=900 loops=1)
                     Hash Cond: (oi.product_id = p.id)
                     ->  Seq Scan on order_items oi  (cost=0.00..35.00 rows=900 width=12) (actual time=0.012..0.890 rows=900 loops=1)
                     ->  Hash  (cost=12.00..12.00 rows=260 width=116) (actual time=0.289..0.290 rows=18 loops=1)
                           Buckets: 1024  Batches: 1  Memory Usage: 10kB
                           ->  Seq Scan on products p  (cost=0.00..12.00 rows=260 width=116) (actual time=0.015..0.234 rows=18 loops=1)
 Planning Time: 0.567 ms
 Execution Time: 4.289 ms
```
- **Índice disponible:** `idx_order_items_product_id` (para JOINs)
---

## ESTRUCTURA DEL PROYECTO
```
eval-c1-awos/
├── db/
│   ├── 01_schema.sql
│   ├── 02_seed.sql
│   ├── 03_reports_views.sql
│   ├── 04_indexes.sql
│   └── 05_roles.sql
├── src/
│   ├── app/
│   ├── lib/
│   └── config/
├── docker-compose.yml
├── Dockerfile
├── verify-security.sh       
└── README.md
