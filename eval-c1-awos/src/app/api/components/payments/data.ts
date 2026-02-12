import { paymentMixSchema } from '../../../lib/validation';
import { PaymentMix } from '../../../lib/vw_types';
import { query } from '../../../lib/db1';

export default async function getPayments(searchParams: any) {
    paymentMixSchema.parse(searchParams || {})
    const sql = 'SELECT * FROM vw_payment_mix ORDER BY total_amount DESC'
    const rows: PaymentMix[] = await query(sql);
    return {
        rows: rows
    }
}