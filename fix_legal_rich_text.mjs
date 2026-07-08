import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function generateHtmlFromSections(sections) {
  if (!sections || !Array.isArray(sections)) return "";
  return sections.map(section => {
    let html = `<h2>${section.title || ''}</h2>`;
    if (section.description) html += `<p>${section.description}</p>`;
    if (section.items && section.items.length > 0) {
      html += `<ul>${section.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }
    return html;
  }).join('');
}

async function run() {
  const { data: allContent } = await supabase.from('site_content').select('*').in('id', ['legal_page', 'privacy_page']);
  
  if (!allContent) {
    console.error("No content found");
    return;
  }

  for (let row of allContent) {
    const content = row.content || {};

    if (content.content && content.content.length > 0) {
      content.rich_text = generateHtmlFromSections(content.content);
    }
    if (content.content_es && content.content_es.length > 0) {
      content.rich_text_es = generateHtmlFromSections(content.content_es);
    }
      
    const { error } = await supabase.from('site_content').upsert({ id: row.id, content: content });
    if (error) {
      console.error(`Error updating ${row.id}`, error);
    } else {
      console.log(`${row.id} updated with correct rich text.`);
    }
  }
}
run();
