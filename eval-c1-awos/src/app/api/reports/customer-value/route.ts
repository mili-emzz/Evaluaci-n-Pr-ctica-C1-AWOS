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

        const { page, limit } = parsed.data;
        const offset = (page - 1) * limit;

        const sql = 'SELECT * FROM vw_customer_value ORDER BY total_spent DESC LIMIT $1 OFFSET $2';
        const rows: CustomerValue[] = await query(sql, [limit, offset]);

        return NextResponse.json({ rows, page, limit });

    } catch (error) {
        console.error('Error in GET /api/reports/customer-value:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
