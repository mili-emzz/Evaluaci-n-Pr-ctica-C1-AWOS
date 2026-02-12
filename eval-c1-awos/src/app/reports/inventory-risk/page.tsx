import getInventory from '@/app/api/components/inventory/data';

export default async function Page({ searchParams }: { searchParams: any }) {

  const {rows} = await getInventory(searchParams);
  const countAtRisk = rows.length;

  return (
    <div style={{ padding: 24 }}>
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
