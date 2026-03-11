import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const categoryParam = searchParams.get('category');
    const flowType = searchParams.get('flow_type');
    const search = searchParams.get('search');

    const supabase = getSupabaseServerClient();

    // Query transactions and join with dim_categories
    let query = supabase
      .from('transactions')
      .select(`
        id,
        start_date,
        description,
        amount,
        currency,
        type,
        dim_categories!left(
          category,
          flow_type,
          flow_sub_type,
          is_recurrent
        )
      `)
      .order('start_date', { ascending: false });

    // Apply strict database filters
    if (startDate) {
      query = query.gte('start_date', startDate);
    }
    if (endDate) {
      query = query.lte('start_date', endDate);
    }
    if (flowType && flowType !== 'all') {
      query = query.eq('dim_categories.flow_type', flowType);
    }
    if (categoryParam && categoryParam !== 'all') {
      const catList = categoryParam.split(',').map(c => c.trim());
      query = query.in('dim_categories.category', catList);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }

    // Map to flat structure to match legacy Pandas API
    let formattedData = (data || []).map(tx => {
      const cat = Array.isArray(tx.dim_categories) ? tx.dim_categories[0] : tx.dim_categories;
      
      // format date as YYYY-MM-DD
      let dateStr = tx.start_date;
      if (dateStr && dateStr.includes('T')) {
         dateStr = dateStr.split('T')[0];
      }

      return {
        id: tx.id,
        date: dateStr,
        description: tx.description,
        amount: tx.amount,
        currency: tx.currency,
        category: cat?.category || null,
        flow_type: cat?.flow_type || null,
        flow_sub_type: cat?.flow_sub_type || null,
        is_recurrent: cat?.is_recurrent || null,
        type: tx.type || null
      };
    });

    // Apply search filter in-memory if requested (matches Pandas OR logic)
    if (search) {
      const term = search.toLowerCase();
      formattedData = formattedData.filter(item => {
        const descMatch = item.description?.toLowerCase().includes(term);
        const catMatch = item.category?.toLowerCase().includes(term);
        return descMatch || catMatch;
      });
    }

    return NextResponse.json(formattedData);
  } catch (err) {
    console.error('Unexpected error in GET /api/transactions:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
