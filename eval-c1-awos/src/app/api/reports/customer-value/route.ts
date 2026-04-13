import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { customerValueSchema } from '@/lib/validation';
import { CustomerValue } from '@/lib/vw_types';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const parsed = customerValueSchema.safeParse({
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
        let sql = 'SELECT * FROM vw_customer_value';

        if (search) {
            sql += ' WHERE customer_name ILIKE $1 OR customer_email ILIKE $1';
            params.push(`%${search}%`);
        }

        sql += ` ORDER BY total_spent DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const rows: CustomerValue[] = await query(sql, params);

        return NextResponse.json({ rows, page, limit });

    } catch (error) {
        console.error('Error in GET /api/reports/customer-value:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
