import { query } from '../../../lib/db1';
import { inventoryRiskSchema } from '../../../lib/validation';
import { InventoryRisk } from '../../../lib/vw_types';

export default async function getInventory(searchParams: any) {
    const validated = inventoryRiskSchema.parse(searchParams);

    let sql = 'SELECT * FROM vw_inventory_risk';
    const params: any[] = [];

    if (validated.category_id !== undefined) {
        sql += ` WHERE category_id = $1`;
        params.push(validated.category_id);
    }
    sql += ' ORDER BY stock_percentage ASC LIMIT 100';

    const rows: InventoryRisk[] = await query(sql, params);

    return {
        rows: rows,
        selectedCategory: validated.category_id
    }
}


