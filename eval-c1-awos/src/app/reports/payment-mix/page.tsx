import getPayments from '@/app/api/components/payments/data';

export default async function Page({ searchParams }: { searchParams: any }) {
  const {rows} = await getPayments(searchParams);
  const main = rows[0];

  return (
    <div style={{ padding: 24 }}>
      <h2>Mix de Pagos</h2>
      <p>Insight: distribución de métodos de pago.</p>
      <div style={{ margin: '8px 0' }}>KPI — Método líder: {main?.method_name ?? '—'}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Método</th><th>Transacciones</th><th>Monto</th><th>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.method_id}>
              <td>{r.method_name}</td>
              <td>{r.transaction_count}</td>
              <td>{r.total_amount}</td>
              <td>{r.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
