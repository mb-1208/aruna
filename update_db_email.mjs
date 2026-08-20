import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('--- Updating Supabase Database Email References ---');
  
  // 1. Update site_content (global_settings)
  const { data: contentData, error: contentError } = await supabase.from('site_content').select('*').eq('id', 'global_settings').single();
  
  if (contentError) {
    console.error('Error fetching global_settings:', contentError);
  } else if (contentData) {
    let g = contentData.content || {};
    let contentStr = JSON.stringify(g);
    
    // Replace all occurrences of old email in global_settings
    contentStr = contentStr.replace(/hello@aruna\.com/g, 'hello@arunatravelstudio.com');
    contentStr = contentStr.replace(/admin@aruna\.com/g, 'hello@arunatravelstudio.com');
    contentStr = contentStr.replace(/jane@aruna\.com/g, 'hello@arunatravelstudio.com');
    
    const updatedContent = JSON.parse(contentStr);
    
    // Ensure footer and additional_data specifically have the new email
    if (updatedContent.footer) {
      if (updatedContent.footer.en) updatedContent.footer.en.email = 'hello@arunatravelstudio.com';
      if (updatedContent.footer.es) updatedContent.footer.es.email = 'hello@arunatravelstudio.com';
    }
    if (updatedContent.additional_data) {
      updatedContent.additional_data.email = 'hello@arunatravelstudio.com';
    }
    
    const { error: updateError } = await supabase.from('site_content').update({ content: updatedContent }).eq('id', 'global_settings');
    if (updateError) {
      console.error('Error updating site_content:', updateError);
    } else {
      console.log('Successfully updated site_content (global_settings)!');
    }
  }

  // 2. Update policies table if it exists
  const { data: policiesData, error: policiesError } = await supabase.from('policies').select('*');
  if (!policiesError && policiesData && policiesData.length > 0) {
    for (const policy of policiesData) {
      let contentStr = JSON.stringify(policy);
      if (contentStr.includes('aruna.com')) {
        contentStr = contentStr.replace(/hello@aruna\.com/g, 'hello@arunatravelstudio.com');
        contentStr = contentStr.replace(/helllo@aruna\.com/g, 'hello@arunatravelstudio.com');
        const updatedPolicy = JSON.parse(contentStr);
        await supabase.from('policies').update(updatedPolicy).eq('id', policy.id);
        console.log(`Updated policy ${policy.id}`);
      }
    }
  }

  console.log('--- Finished updating Supabase Database! ---');
}

run();
