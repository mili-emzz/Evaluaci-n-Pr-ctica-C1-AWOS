import { api } from '@/lib/api-client';
import { CustomerValue } from '@/lib/vw_types';
import Link from 'next/link';

export default async function CustomerPage(
  { searchParams }: { searchParams: Promise<{ search?: string; page?: string; limit?: string }> }
) {
  const params = await searchParams;
  const search = params.search || '';
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const { rows } = await api.customerValue({ search, page, limit });
  const topCustomer = rows[0];

  return (
    <div style={{ padding: 24 }}>
      <Link href="/">
        <button style={{ margin: '8px 0' }}>Volver a Reportes</button>
      </Link>
      <h2>Valor de Clientes</h2>

      <form method="get" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          name="search"
          placeholder="Buscar por cliente o email"
          defaultValue={search}
          style={{ padding: '0.5rem', flex: 1, border: '1px solid #000', borderRadius: '4px' }}
        />
        <input type="hidden" name="page" value="1" />
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Buscar
        </button>
      </form>

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
            href={`?search=${search}&page=${page - 1}&limit=${limit}`}
            style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', textDecoration: 'none', borderRadius: '4px' }}
          >
            ← Anterior
          </Link>
        )}
        <span style={{ padding: '0.5rem 1rem', backgroundColor: '#1976d2', color: 'white', borderRadius: '4px' }}>
          Página {page}
        </span>

        {page < 10 && rows.length === limit && (
          <Link
            href={`?search=${search}&page=${page + 1}&limit=${limit}`}
            style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', textDecoration: 'none', borderRadius: '4px' }}
          >
            Siguiente →
          </Link>
        )}
      </div>
    </div>
  );
}

