import { topProductsSchema } from "../../../lib/validation";
import { TopProduct } from "../../../lib/vw_types";
import { query } from '@/app/lib/db1'


export default async function getProducts(searchParams: any) {

    const paramsObj = await Promise.resolve(searchParams || {});
    const parsed = topProductsSchema.parse(paramsObj);
    const { search, page, limit } = parsed;
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

    return {
        rows: rows,
    }
}