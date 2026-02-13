
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { inventoryRiskSchema } from '@/lib/validation';
import { InventoryRisk } from '@/lib/vw_types';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const parsed = inventoryRiskSchema.safeParse({
            category_id: searchParams.get('category_id'),
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Parámetros inválidos', details: parsed.error.errors },
                { status: 400 }
            );
        }

        const { category_id } = parsed.data;
        let sql = 'SELECT * FROM vw_inventory_risk';
        const params: any[] = [];

        if (category_id !== undefined) {
            sql += ` WHERE category_id = $1`;
            params.push(category_id);
        }

        sql += ' ORDER BY stock_percentage ASC LIMIT 100';

        const rows: InventoryRisk[] = await query(sql, params);

        return NextResponse.json({ rows, selectedCategory: category_id });

    } catch (error) {
        console.error('Error in GET /api/reports/inventory-risk:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}