import { query } from '../../../lib/db1';
import { customerValueSchema } from '../../../lib/validation';
import { CustomerValue } from '../../../lib/vw_types';

export default async function getCustomer(searchParams: any) {
    const validated = customerValueSchema.parse(searchParams)
    const offset = (validated.page - 1) * validated.limit;

    const sql = 'SELECT * FROM vw_customer_value ORDER BY total_spent DESC LIMIT $1 OFFSET $2';
    const rows: CustomerValue[] = await query(sql, [validated.limit, offset]);
    return {
        rows: rows,
        page: validated.page,
        limit: validated.limit
    }
}
