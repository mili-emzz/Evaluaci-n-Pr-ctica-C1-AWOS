import getSales from "@/app/api/components/sales/data";

export default async function Page({ searchParams }: { searchParams: any }) {

  const {rows} = await getSales(searchParams)
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
