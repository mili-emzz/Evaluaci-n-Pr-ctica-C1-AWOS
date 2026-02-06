import Link from 'next/link';

export default function Home() {
  const reports = [
    { 
      id: 1, 
      title: 'Ventas Diarias', 
      desc: 'Análisis de ventas por día', 
      href: '/reports/sales-daily' 
    },
    { 
      id: 2, 
      title: 'Productos Top', 
      desc: 'Rankings de productos más vendidos', 
      href: '/reports/top-products' 
    },
    { 
      id: 3, 
      title: 'Inventario en Riesgo', 
      desc: 'Productos con stock bajo', 
      href: '/reports/inventory-risk' 
    },
    { 
      id: 4, 
      title: 'Valor de Clientes', 
      desc: 'Análisis de clientes por gasto', 
      href: '/reports/customer-value' 
    },
    { 
      id: 5, 
      title: 'Mix de Pagos', 
      desc: 'Distribución de métodos de pago', 
      href: '/reports/payment-mix' 
    },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Dashboard - Cafetería Campus</h1>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '20px' 
      }}>
        {reports.map((report) => (
          <Link
            key={report.id}
            href={report.href}
            style={{
              display: 'block',
              width: '300px',
              padding: '20px',
              border: '1px solid #606060',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <h3 style={{ marginBottom: '10px' }}>{report.title}</h3>
            <p style={{ color: '#666' }}>{report.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}