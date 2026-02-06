import { query } from '../../../lib/db';
import { salesDailySchema } from '../../../lib/validation';
import { SalesDaily } from '../../../lib/vw_types';

export default async function Page({ searchParams }: { searchParams: any }) {
  const paramsObj = await Promise.resolve(searchParams || {});
  const parsed = salesDailySchema.safeParse(paramsObj);
  const dateFrom = parsed.success ? parsed.data.date_from : undefined;
  const dateTo = parsed.success ? parsed.data.date_to : undefined;

  const params: any[] = [];
  let sql = 'SELECT * FROM vw_sales_daily';
  if (dateFrom && dateTo) {
    sql += ' WHERE sale_date BETWEEN $1 AND $2 ORDER BY sale_date DESC LIMIT 100';
    params.push(dateFrom, dateTo);
  } else {
    sql += ' ORDER BY sale_date DESC LIMIT 50';
  }

  const rows: SalesDaily[] = await query(sql, params);
  const kpi = rows.reduce((s, r) => s + Number(r.total_sales || 0), 0);

  return (
    <div style={{ padding: 24 }}>
      <h2>Ventas Diarias</h2>
      <p>Insight: ventas agregadas por día.</p>
      <div style={{ margin: '8px 0' }}>KPI — Total ventas: {kpi}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Fecha</th><th>Tickets</th><th>Total</th><th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.sale_date}>
              <td>{r.sale_date}</td>
              <td>{r.total_tickets}</td>
              <td>{r.total_sales}</td>
              <td>{r.avg_ticket}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
