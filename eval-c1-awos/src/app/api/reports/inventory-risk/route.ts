
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { inventoryRiskSchema } from '@/lib/validation';
import { InventoryRisk } from '@/lib/vw_types';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const parsed = inventoryRiskSchema.safeParse({
            search: searchParams.get('search'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            category_id: searchParams.get('category_id'),
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Parámetros inválidos', details: parsed.error.errors },
                { status: 400 }
            );
        }

        const { search, category_id, page, limit } = parsed.data;
        const offset = (page - 1) * limit;

        let sql = 'SELECT * FROM vw_inventory_risk';
        const params: any[] = [];
        const conditions: string[] = [];

        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(product_name ILIKE $${params.length} OR category_name ILIKE $${params.length})`);
        }
        
        if (category_id !== undefined) {
            params.push(category_id);
            conditions.push(`category_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(' AND ')}`;
        }

        params.push(limit, offset);
        sql += ` ORDER BY stock_percentage ASC LIMIT $${params.length - 1} OFFSET $${params.length}`;

        const rows: InventoryRisk[] = await query(sql, params);

        return NextResponse.json({ rows, selectedCategory: category_id, page, limit });

    } catch (error) {
        console.error('Error in GET /api/reports/inventory-risk:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}