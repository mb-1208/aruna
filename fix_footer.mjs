import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: contentData } = await supabase.from('site_content').select('*').eq('id', 'global_settings').single();
  
  if (contentData) {
    let g = contentData.content;
    
    // Fix EN footer structure
    if (g.footer && g.footer.en) {
      const enF = g.footer.en;
      g.footer.en = {
        description: enF.tagline || enF.description,
        phone: g.additional_data?.phone || "+62 851 2222 3333",
        email: g.additional_data?.email || "hello@arunatravelstudio.com",
        company_title: enF.column1Title || enF.company_title,
        newsletter_title: enF.column2Title || enF.newsletter_title,
        newsletter_desc: enF.newsletterText || enF.newsletter_desc,
        subscribe_btn: enF.newsletterButton || enF.subscribe_btn,
        copyright: enF.copyright,
        link_contact: enF.link5 || enF.link_contact,
        link_legal: enF.legal || enF.link_legal,
        link_privacy: enF.privacy || enF.link_privacy
      };
    }

    // Fix ES footer structure
    if (g.footer && g.footer.es) {
      const esF = g.footer.es;
      g.footer.es = {
        description: esF.tagline || esF.description,
        phone: g.additional_data?.phone || "+62 851 2222 3333",
        email: g.additional_data?.email || "hello@arunatravelstudio.com",
        company_title: esF.column1Title || esF.company_title,
        newsletter_title: esF.column2Title || esF.newsletter_title,
        newsletter_desc: esF.newsletterText || esF.newsletter_desc,
        subscribe_btn: esF.newsletterButton || esF.subscribe_btn,
        copyright: esF.copyright,
        link_contact: esF.link5 || esF.link_contact,
        link_legal: esF.legal || esF.link_legal,
        link_privacy: esF.privacy || esF.link_privacy
      };
    }

    const { error } = await supabase.from('site_content').upsert({ id: 'global_settings', content: g });
    if (error) {
      console.error("Error updating", error);
    } else {
      console.log("Footer structure fixed.");
    }
  }
}
run();
