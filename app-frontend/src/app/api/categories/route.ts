import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { Category } from '@/types/api';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    // Fetch from finance.dim_categories
    const { data: categories, error } = await supabase
      .from('dim_categories')
      .select('id, flow_type, flow_sub_type, category, is_recurrent')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }

    // Explicitly cast to our shared type (though Supabase generated types would be better in a larger project)
    return NextResponse.json(categories as Category[]);
  } catch (err) {
    console.error('Unexpected error in GET /api/categories:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
