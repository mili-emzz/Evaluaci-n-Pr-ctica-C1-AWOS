import { api } from '@/lib/api-client';
import Link from 'next/link';

export default async function TopProductsPage({ searchParams }: { searchParams: { search?: string, page?: number, limit?: number } }) {

  const search = searchParams.search || '';
  const page = searchParams.page || 1;
  const limit = searchParams.limit || 10;
  
  const { rows } = await api.topProducts({ search, page, limit });
  const totalRevenue = rows.reduce((s, r) => s + Number(r.total_revenue || 0), 0);

  return (
    <div style={{ padding: 24 }}>
      <Link href="/">
        <button style={{ margin: '8px 0' }}>Volver a Reportes</button>
      </Link>
      <h2>Productos Top</h2>
      <form method="get" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          name="search"
          placeholder="Buscar producto"
          defaultValue={search}
          style={{ padding: '0.5rem', flex: 1, border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input type="hidden" name="page" value="1" />
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }}>
          Buscar
        </button>
      </form>
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

        <Link
          href={`?search=${search}&page=${page + 1}&limit=${limit}`}
          style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', textDecoration: 'none', borderRadius: '4px' }}
        >
          Siguiente →
        </Link>
      </div>

    </div>
  );
}
