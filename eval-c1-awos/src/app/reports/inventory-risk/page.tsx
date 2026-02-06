import { query } from '../../../lib/db';
import { inventoryRiskSchema } from '../../../lib/validation';
import { InventoryRisk } from '../../../lib/vw_types';

export default async function Page({ searchParams }: { searchParams: any }) {
  const paramsObj = await Promise.resolve(searchParams || {});
  const p = inventoryRiskSchema.safeParse(paramsObj);
  const category_id = p.success ? p.data.category_id : undefined;

  const params: any[] = [];
  let sql = 'SELECT * FROM vw_inventory_risk';
  if (category_id !== undefined) {
    params.push(category_id);
    sql += ` WHERE category_id = $1`;
  }
  sql += ' ORDER BY stock_percentage ASC LIMIT 100';

  const rows: InventoryRisk[] = await query(sql, params);
  const countAtRisk = rows.length;

  return (
    <div style={{ padding: 24 }}>
      <h2>Inventario en Riesgo</h2>
      <p>Insight: productos con stock bajo por categoría.</p>
      <div style={{ margin: '8px 0' }}>KPI — Productos en riesgo: {countAtRisk}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Producto</th><th>Categoría</th><th>Stock</th><th>Riesgo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.product_id}>
              <td>{r.product_name}</td>
              <td>{r.category_name}</td>
              <td>{r.current_stock}</td>
              <td>{r.risk_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
