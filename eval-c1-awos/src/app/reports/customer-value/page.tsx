import { query } from '../../../lib/db';
import { customerValueSchema } from '../../../lib/validation';
import { CustomerValue } from '../../../lib/vw_types';

export default async function Page({ searchParams }: { searchParams: any }) {
  const paramsObj = await Promise.resolve(searchParams || {});
  const { page, limit } = customerValueSchema.parse(paramsObj);
  const offset = (page - 1) * limit;

  const sql = 'SELECT * FROM vw_customer_value ORDER BY total_spent DESC LIMIT $1 OFFSET $2';
  const rows: CustomerValue[] = await query(sql, [limit, offset]);
  const topCustomer = rows[0];

  return (
    <div style={{ padding: 24 }}>
      <h2>Valor de Clientes</h2>
      <p>Insight: clientes ordenados por gasto total.</p>
      <div style={{ margin: '8px 0' }}>KPI — Top cliente: {topCustomer?.customer_name ?? '—'}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Cliente</th><th>Pedidos</th><th>Total</th><th>Segmento</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.customer_id}>
              <td>{r.customer_name}</td>
              <td>{r.order_count}</td>
              <td>{r.total_spent}</td>
              <td>{r.segment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
