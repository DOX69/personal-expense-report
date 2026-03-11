import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    const supabase = getSupabaseServerClient();

    let query = supabase
      .from('transactions')
      .select(`
        amount,
        dim_categories!inner(flow_type)
      `)
      // .neq('dim_categories.flow_type', 'transfer') -> wait, inner join filter syntax in postgrest:
      // dim_categories!inner(flow_type) & .neq('dim_categories.flow_type', 'transfer')
      .neq('dim_categories.flow_type', 'transfer');

    if (startDate) {
      query = query.gte('start_date', startDate);
    }
    if (endDate) {
      query = query.lte('start_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching metrics data:', error);
      return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }

    let total_income = 0;
    let total_expense = 0;

    for (const tx of data || []) {
      const cat = Array.isArray(tx.dim_categories) ? tx.dim_categories[0] : tx.dim_categories;
      const flowType = cat?.flow_type;
      
      if (flowType === 'income') {
        total_income += (tx.amount || 0);
      } else if (flowType === 'expense') {
        total_expense += (tx.amount || 0);
      }
    }

    const net_cashflow = total_income + total_expense;

    return NextResponse.json({
      total_income,
      total_expense,
      net_cashflow
    });
  } catch (err) {
    console.error('Unexpected error in GET /api/dashboard/metrics:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
