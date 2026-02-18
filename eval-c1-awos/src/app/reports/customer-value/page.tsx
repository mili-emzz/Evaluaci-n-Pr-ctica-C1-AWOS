import { api } from '@/lib/api-client';
import { CustomerValue } from '@/lib/vw_types';
import Link from 'next/link';

export default async function CustomerPage(
  { searchParams }: { searchParams: Promise<{ page?: string; limit?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const { rows } = await api.customerValue({ page, limit });
  const topCustomer = rows[0];

  return (
    <div style={{ padding: 24 }}>
      <Link href="/">
        <button style={{ margin: '8px 0' }}>Volver a Reportes</button>
      </Link>
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
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {page > 1 && (
          <Link
            href={`?page=${page - 1}&limit=${limit}`}
            style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', textDecoration: 'none', borderRadius: '4px' }}
          >
            ← Anterior
          </Link>
        )}
        <span style={{ padding: '0.5rem 1rem', backgroundColor: '#1976d2', color: 'white', borderRadius: '4px' }}>
          Página {page}
        </span>

        <Link
          href={`?page=${page + 1}&limit=${limit}`}
          style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', textDecoration: 'none', borderRadius: '4px' }}
        >
          Siguiente →
        </Link>
      </div>
    </div>
  );
}

