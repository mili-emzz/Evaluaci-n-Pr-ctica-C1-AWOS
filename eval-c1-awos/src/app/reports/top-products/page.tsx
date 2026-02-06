import { query } from '../../../lib/db';
import { topProductsSchema } from '../../../lib/validation';
import { TopProduct } from '../../../lib/vw_types';

export default async function Page({ searchParams }: { searchParams: any }) {
  const paramsObj = await Promise.resolve(searchParams || {});
  const parsed = topProductsSchema.parse(paramsObj);
  const { search, page, limit } = parsed;
  const offset = (page - 1) * limit;

  const params: any[] = [];
  let sql = 'SELECT * FROM vw_top_products_ranked';
  if (search) {
    params.push(`%${search}%`);
    sql += ` WHERE product_name ILIKE $${params.length}`;
  }
  params.push(limit, offset);
  sql += ` ORDER BY total_revenue DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const rows: TopProduct[] = await query(sql, params);
  const totalRevenue = rows.reduce((s, r) => s + Number(r.total_revenue || 0), 0);

  return (
    <div style={{ padding: 24 }}>
      <h2>Productos Top</h2>
      <p>Insight: productos con mayor revenue.</p>
      <div style={{ margin: '8px 0' }}>KPI — Revenue en página: {totalRevenue}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Producto</th><th>Categoría</th><th>Revenue</th><th>Unidades</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.product_id}>
              <td>{r.product_name}</td>
              <td>{r.category_name}</td>
              <td>{r.total_revenue}</td>
              <td>{r.units_sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
