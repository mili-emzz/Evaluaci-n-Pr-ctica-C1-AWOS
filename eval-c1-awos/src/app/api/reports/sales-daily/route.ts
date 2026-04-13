import { NextRequest, NextResponse } from 'next/server';
import { query } from "../../../../lib/db";
import { salesDailySchema } from "../../../../lib/validation";
import { SalesDaily } from "@/lib/vw_types";

export async function GET(request: NextRequest) {

    try {
        const searchParams = request.nextUrl.searchParams;

        const dateFrom = searchParams.get('date_from') || undefined;
        const dateTo = searchParams.get('date_to') || undefined;
        const parsed = salesDailySchema.safeParse({
            date_from: dateFrom,
            date_to: dateTo,
            page: searchParams.get('page'),
            limit: searchParams.get('limit')
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Parámetros inválidos', details: parsed.error.errors },
                { status: 400 }
            );
        }

        const { page = 1, limit = 10 } = parsed.data || {};
        const offset = (page - 1) * limit;
        const params: any[] = [];
        let sql = 'SELECT * FROM vw_sales_daily';

        if (parsed.data.date_from && parsed.data.date_to) {
            sql += ' WHERE sale_date BETWEEN $1 AND $2 ORDER BY sale_date DESC LIMIT $3 OFFSET $4';
            params.push(parsed.data.date_from, parsed.data.date_to, limit, offset);
        } else {
            sql += ' ORDER BY sale_date DESC LIMIT $1 OFFSET $2';
            params.push(limit, offset);
        }

        const rows: SalesDaily[] = await query(sql, params);

        return NextResponse.json({ rows });
    } catch (error) {
        console.error('Error in GET /api/reports/sales-daily:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
         );
    }
}