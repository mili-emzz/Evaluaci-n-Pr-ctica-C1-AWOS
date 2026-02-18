import { api } from '@/lib/api-client';
import { InventoryRisk } from '@/lib/vw_types';
import Link from 'next/link';

export default async function InventoryRiskPage({
  searchParams,
}: {
  searchParams: Promise<{ category_id?: string }>;
}) {

  const params = await searchParams;
  const categoryId =
    params.category_id && !isNaN(Number(params.category_id))
      ? Number(params.category_id)
      : undefined;
  const { rows } = await api.inventoryRisk({ category_id: categoryId });
  const countAtRisk = rows.filter(
    (r: InventoryRisk) => r.risk_level === 'critico' || r.risk_level === 'sin_stock'
  ).length;

  return (
    <div style={{ padding: 24 }}>
      <Link href="/">
        <button style={{ margin: '8px 0' }}>Volver a Reportes</button>
      </Link>
      <h2>Inventario en Riesgo</h2>
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
    </div>
  );
}
