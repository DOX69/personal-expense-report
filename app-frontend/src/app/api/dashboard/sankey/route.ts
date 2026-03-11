import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { SankeyData, SankeyNode, SankeyLink } from '@/types/api';

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
        dim_categories!inner(category, flow_type)
      `)
      .neq('dim_categories.flow_type', 'transfer');

    if (startDate) {
      query = query.gte('start_date', startDate);
    }
    if (endDate) {
      query = query.lte('start_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching sankey data:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ nodes: [], links: [] });
    }

    // Group by category and sum amounts
    const incomeCats: Record<string, number> = {};
    const expenseCats: Record<string, number> = {};
    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of data) {
      const catObj = Array.isArray(tx.dim_categories) ? tx.dim_categories[0] : tx.dim_categories;
      const amount = tx.amount || 0;
      const categoryName = catObj?.category || 'Unknown';

      if (catObj?.flow_type === 'income') {
        incomeCats[categoryName] = (incomeCats[categoryName] || 0) + amount;
        totalIncome += amount;
      } else if (catObj?.flow_type === 'expense') {
        // use absolute amount for sankey chart link values
        expenseCats[categoryName] = (expenseCats[categoryName] || 0) + Math.abs(amount);
        totalExpense += amount; // actual total expense (presumably negative)
      }
    }

    const netCashflow = totalIncome + totalExpense;

    const labels: string[] = [];
    
    // 1. Income source nodes
    for (const catName of Object.keys(incomeCats)) {
      labels.push(`${catName} (Income)`);
    }

    // 2. Central node
    labels.push('Current Account');

    // 3. Expense category nodes
    for (const catName of Object.keys(expenseCats)) {
      labels.push(`${catName} (Expense)`);
    }

    // 4. Net savings node
    if (netCashflow > 0) {
      labels.push('Savings');
    }

    const links: SankeyLink[] = [];
    const centralIdx = labels.indexOf('Current Account');

    // Income -> Current Account
    for (const [catName, amount] of Object.entries(incomeCats)) {
      const src = labels.indexOf(`${catName} (Income)`);
      links.push({
        source: src,
        target: centralIdx,
        value: Number(amount.toFixed(2))
      });
    }

    // Current Account -> Expenses
    for (const [catName, amount] of Object.entries(expenseCats)) {
      const tgt = labels.indexOf(`${catName} (Expense)`);
      links.push({
        source: centralIdx,
        target: tgt,
        value: Number(amount.toFixed(2))
      });
    }

    // Current Account -> Savings
    if (netCashflow > 0) {
      links.push({
        source: centralIdx,
        target: labels.indexOf('Savings'),
        value: Number(netCashflow.toFixed(2))
      });
    }

    const responseData: SankeyData = {
      nodes: labels.map(l => ({ name: l })),
      links
    };

    return NextResponse.json(responseData);
  } catch (err) {
    console.error('Unexpected error in GET /api/dashboard/sankey:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
