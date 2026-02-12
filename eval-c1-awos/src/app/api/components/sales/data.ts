import { query } from "../../../lib/db1";
import { salesDailySchema } from "../../../lib/validation";
import { SalesDaily } from "../../../lib/vw_types";

export default async function getSales(searchParams: any) {

    const paramsObj = await Promise.resolve(searchParams || {});
    const parsed = salesDailySchema.safeParse(paramsObj);
    const dateFrom = parsed.success ? parsed.data.date_from : undefined;
    const dateTo = parsed.success ? parsed.data.date_to : undefined;

    const params: any[] = [];
    let sql = 'SELECT * FROM vw_sales_daily';
    if (dateFrom && dateTo) {
        sql += ' WHERE sale_date BETWEEN $1 AND $2 ORDER BY sale_date DESC LIMIT 50';
        params.push(dateFrom, dateTo);
    } else {
        sql += ' ORDER BY sale_date DESC LIMIT 20';
    }

    const rows: SalesDaily[] = await query(sql, params);

    return {
        rows: rows
    }
}