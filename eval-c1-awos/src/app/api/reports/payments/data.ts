
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { paymentMixSchema } from '@/lib/validation';
import { PaymentMix } from '@/lib/vw_types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const parsed = paymentMixSchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Parámetros inválidos', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const sql = 'SELECT * FROM vw_payment_mix ORDER BY total_amount DESC';
    const rows: PaymentMix[] = await query(sql);
    
    return NextResponse.json({ rows });

  } catch (error) {
    console.error('Error in GET /api/reports/payment-mix:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}