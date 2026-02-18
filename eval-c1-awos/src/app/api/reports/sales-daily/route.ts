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
            date_to: dateTo
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Parámetros inválidos', details: parsed.error.errors },
                { status: 400 }
            );
        }

        const params: any[] = [];
        let sql = 'SELECT * FROM vw_sales_daily';

        if (parsed.data.date_from && parsed.data.date_to) {
            sql += ' WHERE sale_date BETWEEN $1 AND $2 ORDER BY sale_date DESC LIMIT 50';
            params.push(parsed.data.date_from, parsed.data.date_to);
        } else {
            sql += ' ORDER BY sale_date DESC LIMIT 20';
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