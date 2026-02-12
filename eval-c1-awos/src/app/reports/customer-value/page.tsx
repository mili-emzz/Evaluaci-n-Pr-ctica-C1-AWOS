import getCustomer from '@/app/api/components/customer/data';

export default async function Page({ searchParams }: { searchParams: any }) {
  const {rows, page} = await getCustomer(searchParams);
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
