import { api } from '@/lib/api-client';
import { InventoryRisk } from '@/lib/vw_types';
import Link from 'next/link';

export default async function InventoryRiskPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category_id?: string; page?: string; limit?: string }>;
}) {

  const params = await searchParams;
  const search = params.search || '';
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const categoryId =
    params.category_id && !isNaN(Number(params.category_id))
      ? Number(params.category_id)
      : undefined;
  const { rows } = await api.inventoryRisk({ search, category_id: categoryId, page, limit });
  const countAtRisk = rows.filter(
    (r: InventoryRisk) => r.risk_level === 'critico' || r.risk_level === 'sin_stock' || r.risk_level === 'advertencia'
  ).length;

  return (
    <div style={{ padding: 24 }}>
      <Link href="/">
        <button style={{ margin: '8px 0' }}>Volver a Reportes</button>
      </Link>
      <h2>Inventario en Riesgo</h2>

      <form method="get" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          name="search"
          placeholder="Buscar por producto o categoría"
          defaultValue={search}
          style={{ padding: '0.5rem', flex: 1, border: '1px solid #000', borderRadius: '4px' }}
        />
        {categoryId !== undefined && <input type="hidden" name="category_id" value={categoryId} />}
        <input type="hidden" name="page" value="1" />
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Buscar
        </button>
      </form>

      <p>Insight: productos con stock bajo por categoría.</p>
      <div style={{ margin: '8px 0' }}>KPI — Productos en riesgo: {countAtRisk}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Producto</th><th>Categoría</th><th>Stock</th><th>Riesgo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.product_id}>
              <td>{r.product_name}</td>
              <td>{r.category_name}</td>
              <td>{r.current_stock}</td>
              <td>{r.risk_level}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {page > 1 && (
          <Link
            href={`?search=${search}&category_id=${categoryId || ''}&page=${page - 1}&limit=${limit}`}
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
            href={`?search=${search}&category_id=${categoryId || ''}&page=${page + 1}&limit=${limit}`}
            style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', textDecoration: 'none', borderRadius: '4px' }}
          >
            Siguiente →
          </Link>
        )}
      </div>
    </div>
  );
}
