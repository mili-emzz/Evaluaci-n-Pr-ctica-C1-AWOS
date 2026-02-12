import getProducts from '@/app/api/components/products/data';

export default async function Page({ searchParams }: { searchParams: any }) {

  const {rows} = await getProducts(searchParams)
  const totalRevenue = rows.reduce((s, r) => s + Number(r.total_revenue || 0), 0);

  return (
    <div style={{ padding: 24 }}>
      <h2>Productos Top</h2>
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
    </div>
  );
}
