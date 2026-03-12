import { getSupabaseServerClient } from '../supabaseServer';

describe('Supabase Integration', () => {
  it('should be able to query dim_categories from finance schema', async () => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('dim_categories')
      .select('id, category')
      .limit(5);
    
    if (error) {
      console.error('Integration test failed with error:', error);
    }

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data?.length).toBeGreaterThanOrEqual(0);
  });
});
