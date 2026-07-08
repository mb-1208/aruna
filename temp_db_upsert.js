require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_schema_info', { table_name: 'site_content' });
  if (error) {
     console.log("RPC failed, trying query information_schema");
     const { data: cols } = await supabase.from('information_schema.columns').select('*').eq('table_name', 'site_content');
     // unfortunately postgrest might not expose information_schema by default. Let's just try an upsert.
  }
}

async function testUpsert() {
  const res = await supabase.from('site_content').upsert({ id: 'home_page', content: { test: true } });
  console.log("Upsert id='home_page' result:", res.error ? res.error.message : "Success");
}
testUpsert();
