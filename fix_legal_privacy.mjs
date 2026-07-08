import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: allContent } = await supabase.from('site_content').select('*');
  
  if (!allContent) {
    console.error("No content found");
    return;
  }

  for (let enId of ['legal_page', 'privacy_page']) {
    const esId = `${enId}_es`;
    const enRow = allContent.find(r => r.id === enId);
    const esRow = allContent.find(r => r.id === esId);
    
    if (enRow && esRow) {
      enRow.content.title_es = esRow.content.title || esRow.content.headline;
      enRow.content.content_es = esRow.content.content;
      enRow.content.rich_text_es = esRow.content.rich_text;
      
      const { error } = await supabase.from('site_content').upsert({ id: enId, content: enRow.content });
      if (error) {
        console.error(`Error updating ${enId}`, error);
      } else {
        console.log(`${enId} updated with ES content.`);
      }
    }
  }
}
run();
