require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log("Fetching site_content...");
  const { data: d1 } = await supabase.from('site_content').select('*');
  console.log(JSON.stringify(d1, null, 2));

  console.log("Fetching retreats_destinations...");
  const { data: d2 } = await supabase.from('retreats_destinations').select('*');
  console.log(JSON.stringify(d2, null, 2));

  console.log("Fetching reviews...");
  const { data: d3 } = await supabase.from('reviews').select('*');
  console.log(JSON.stringify(d3, null, 2));
}

run();
