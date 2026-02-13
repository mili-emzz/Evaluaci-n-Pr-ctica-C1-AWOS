import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { topProductsSchema } from '@/lib/validation';
import { TopProduct } from '@/lib/vw_types';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const parsed = topProductsSchema.safeParse({
            search: searchParams.get('search'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Parámetros inválidos', details: parsed.error.errors },
                { status: 400 }
            );
        }

        const { search, page, limit } = parsed.data;
        const offset = (page - 1) * limit;
        const params: any[] = [];
        let sql = 'SELECT * FROM vw_top_products_ranked';

        if (search) {
            params.push(`%${search}%`);
            sql += ` WHERE product_name ILIKE $${params.length}`;
        }

        params.push(limit, offset);
        sql += ` ORDER BY total_revenue DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

        const rows: TopProduct[] = await query(sql, params);

        return NextResponse.json({ rows, page, limit });

    } catch (error) {
        console.error('Error in GET /api/reports/top-products:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}