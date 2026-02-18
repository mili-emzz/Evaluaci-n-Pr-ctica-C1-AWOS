import { api } from '@/lib/api-client';
import { SalesDaily } from '@/lib/vw_types';
import Link from 'next/link';

export default async function SalesPage({ searchParams }: { searchParams: Promise<{ date_from?: string, date_to?: string }> }) {

  const params = await searchParams
  const { rows } = await api.salesDaily(params)
  const kpi = rows.reduce((s, r) => s + Number(r.total_sales || 0), 0);
  const from =
    params.date_from && params.date_from !== ''
      ? params.date_from
      : undefined;

  const to =
    params.date_to && params.date_to !== ''
      ? params.date_to
      : undefined;


  return (
    <div style={{ padding: 24 }}>

      <Link href="/">
        <button style={{ margin: '8px 0' }}>Volver a Reportes</button>
      </Link>

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
            <tr key={r.sale_date.toString()}>
              <td>{new Date(r.sale_date).toISOString().split('T')[0]}</td>              <td>{r.total_tickets}</td>
              <td>{r.total_sales}</td>
              <td>{r.avg_ticket}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
