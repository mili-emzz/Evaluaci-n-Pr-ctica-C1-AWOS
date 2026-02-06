export const REPORTS = [
  { 
    id: 'sales-daily',
    title: 'Ventas Diarias', 
    description: 'Análisis de ventas por día con filtros de fecha',
    href: '/reports/sales-daily',
    icon: '📊'
  },
  { 
    id: 'top-products',
    title: 'Productos Top', 
    description: 'Rankings de productos más vendidos',
    href: '/reports/top-products',
    icon: '🏆'
  },
  { 
    id: 'inventory-risk',
    title: 'Inventario en Riesgo', 
    description: 'Productos con stock bajo o crítico',
    href: '/reports/inventory-risk',
    icon: '⚠️'
  },
  { 
    id: 'customer-value',
    title: 'Valor de Clientes', 
    description: 'Análisis de clientes por gasto y frecuencia',
    href: '/reports/customer-value',
    icon: '💎'
  },
  { 
    id: 'payment-mix',
    title: 'Mix de Pagos', 
    description: 'Distribución de métodos de pago',
    href: '/reports/payment-mix',
    icon: '💳'
  },
] as const;

export const CATEGORIES = [
  { id: 1, name: 'Bebidas frías' },
  { id: 2, name: 'Bebidas calientes' },
  { id: 3, name: 'Panadería' },
  { id: 4, name: 'Postres' },
  { id: 5, name: 'Desayunos' },
  { id: 6, name: 'Comidas' },
] as const;

export const VALID_CATEGORY_IDS = CATEGORIES.map(c => c.id);