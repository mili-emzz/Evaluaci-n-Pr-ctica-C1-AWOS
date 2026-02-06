import { query } from '@/lib/db';
import { salesDailySchema } from '@/lib/validation';
import type { SalesDaily } from '@/lib/vw_types';

type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
};

export default async function SalesDailyPage({ searchParams }: Props) {
    const parsed = salesDailySchema.safeParse(searchParams);

    if (!parsed.success) {
        return <div style={{ padding: '20px' }}>Error en parámetros</div>;
    }

    const { date_from, date_to } = parsed.data;

    let sql = 'SELECT * FROM vw_sales_daily WHERE 1=1';
    const params: string[] = [];
    let paramIndex = 1;

    if (date_from) {
        sql += ` AND sale_date >= $${paramIndex}`;
        params.push(date_from);
        paramIndex++;
    }

    if (date_to) {
        sql += ` AND sale_date <= $${paramIndex}`;
        params.push(date_to);
        paramIndex++;
    }

    sql += ' ORDER BY sale_date DESC LIMIT 30';

    const sales = await query<SalesDaily>(sql, params);

    const totalSales = sales.reduce((sum, s) => sum + Number(s.total_sales), 0);
    const totalTickets = sales.reduce((sum, s) => sum + Number(s.total_tickets), 0);
    const avgTicketGlobal = totalTickets > 0 ? totalSales / totalTickets : 0;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>📊 Ventas Diarias</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
                Análisis de ventas completadas por día con filtros de rango de fechas
            </p>

            <form method="get" style={{
                marginBottom: '30px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                    <div>
                        <label htmlFor="date_from" style={{ display: 'block', marginBottom: '5px' }}>
                            Desde:
                        </label>
                        <input
                            type="date"
                            id="date_from"
                            name="date_from"
                            defaultValue={date_from}
                            style={{ padding: '8px', fontSize: '14px' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="date_to" style={{ display: 'block', marginBottom: '5px' }}>
                            Hasta:
                        </label>
                        <input
                            type="date"
                            id="date_to"
                            name="date_to"
                            defaultValue={date_to}
                            style={{ padding: '8px', fontSize: '14px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '8px 20px',
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Filtrar
                    </button>

                    <a
                        href="/reports/sales-daily"
                        style={{
                            padding: '8px 20px',
                            border: '1px solid #000',
                            textDecoration: 'none',
                            color: '#000'
                        }}
                    >
                        Limpiar
                    </a>
                </div>
            </form>

            {/* KPIs */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '30px',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '20px',
                    border: '2px solid #4CAF50',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        TOTAL VENTAS
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                        ${totalSales.toLocaleString()}
                    </div>
                </div>

                <div style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '20px',
                    border: '2px solid #2196F3',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        TICKETS TOTALES
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                        {totalTickets}
                    </div>
                </div>

                <div style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '20px',
                    border: '2px solid #FF9800',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        TICKET PROMEDIO
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                        ${avgTicketGlobal.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* TABLA */}
            {sales.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    No hay datos para el rango seleccionado
                </p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        border: '1px solid #ddd'
                    }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5' }}>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #000' }}>
                                    Fecha
                                </th>
                                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #000' }}>
                                    Tickets
                                </th>
                                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #000' }}>
                                    Total Ventas
                                </th>
                                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #000' }}>
                                    Ticket Promedio
                                </th>
                                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #000' }}>
                                    Categoría
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>
                                        {new Date(row.sale_date).toLocaleDateString('es-MX')}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        {row.total_tickets}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                                        ${Number(row.total_sales).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        ${Number(row.avg_ticket).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            background: row.sales_category === 'alta' ? '#4CAF50' :
                                                row.sales_category === 'media' ? '#FF9800' : '#999',
                                            color: '#fff'
                                        }}>
                                            {row.sales_category}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ marginTop: '30px' }}>
                <a href="/" style={{ color: '#2196F3', textDecoration: 'none' }}>
                    ← Volver al dashboard
                </a>
            </div>
        </div>
    );
}