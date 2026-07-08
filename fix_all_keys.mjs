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

  for (let row of allContent) {
    let content = row.content || {};

    if (row.id === 'home_page') {
      content.travelTitle = content.travelHeadline || content.travelTitle;
      content.retreatsTitle = content.retreatsHeadline || content.retreatsTitle;
      
      if (content.es) {
        content.es.travelTitle = content.es.travelHeadline || content.es.travelTitle;
        content.es.retreatsTitle = content.es.retreatsHeadline || content.es.retreatsTitle;
      }
    }
    
    if (row.id === 'travel_page') {
      content.heroTitle = content.heroHeadline || content.heroTitle;
      content.scrollText = content.scrollLabel || content.scrollText;
      content.aboutSubtitle = content.aboutLabel || content.aboutSubtitle;
      content.aboutTitle = content.aboutHeadline || content.aboutTitle;
      content.aboutText = content.aboutBody || content.aboutText;
      content.testimonialsSubtitle = content.testimonialsLabel || content.testimonialsSubtitle;
      content.testimonialsTitle = content.testimonialsHeadline || content.testimonialsTitle;
      content.faqSubtitle = content.faqLabel || content.faqSubtitle;
      content.faqTitle = content.faqHeadline || content.faqTitle;
      content.ctaTitle = content.ctaHeadline || content.ctaTitle;
      content.ctaPromoText = content.ctaPromoBadge || content.ctaPromoText;
      content.ctaText = content.ctaButton || content.ctaText;
      
      if (content.es) {
        content.es.heroTitle = content.es.heroHeadline || content.es.heroTitle;
        content.es.scrollText = content.es.scrollLabel || content.es.scrollText;
        content.es.aboutSubtitle = content.es.aboutLabel || content.es.aboutSubtitle;
        content.es.aboutTitle = content.es.aboutHeadline || content.es.aboutTitle;
        content.es.aboutText = content.es.aboutBody || content.es.aboutText;
        content.es.testimonialsSubtitle = content.es.testimonialsLabel || content.es.testimonialsSubtitle;
        content.es.testimonialsTitle = content.es.testimonialsHeadline || content.es.testimonialsTitle;
        content.es.faqSubtitle = content.es.faqLabel || content.es.faqSubtitle;
        content.es.faqTitle = content.es.faqHeadline || content.es.faqTitle;
        content.es.ctaTitle = content.es.ctaHeadline || content.es.ctaTitle;
        content.es.ctaPromoText = content.es.ctaPromoBadge || content.es.ctaPromoText;
        content.es.ctaText = content.es.ctaButton || content.es.ctaText;
      }
    }
    
    if (row.id === 'retreats_page') {
      content.heroTitle = content.heroHeadline || content.heroTitle;
      content.scrollText = content.scrollLabel || content.scrollText;
      content.introSubtitle = content.introSubtitle; 
      content.introTitle = content.introHeadline || content.introTitle;
      content.introText1 = content.introBody1 || content.introText1;
      content.introText2 = content.introBody2 || content.introText2;
      content.introButtonText = content.introButton || content.introButtonText;
      content.introModalTitle = content.introPopupHeadline || content.introModalTitle;
      content.introModalText = content.introPopupBody || content.introModalText;
      content.experienceSubtitle = content.destinationsSubtitle || content.experienceSubtitle;
      content.experienceTitle = content.destinationsHeadline || content.experienceTitle;
      content.quoteSubtitle = content.testimonialsSubtitle || content.quoteSubtitle;
      content.quoteTitle = content.testimonialsHeadline || content.quoteTitle;
      content.mosaicTitle = content.galleryHeadline || content.mosaicTitle;
      content.faqSubtitle = content.faqSubtitle;
      content.faqTitle = content.faqHeadline || content.faqTitle;
      content.ctaTitle = content.ctaHeadline || content.ctaTitle;
      content.ctaText = content.ctaSubtext || content.ctaText;
      content.ctaButtonText = content.ctaButton || content.ctaButtonText;
      
      if (content.es) {
        content.es.heroTitle = content.es.heroHeadline || content.es.heroTitle;
        content.es.scrollText = content.es.scrollLabel || content.es.scrollText;
        content.es.introSubtitle = content.es.introSubtitle;
        content.es.introTitle = content.es.introHeadline || content.es.introTitle;
        content.es.introText1 = content.es.introBody1 || content.es.introText1;
        content.es.introText2 = content.es.introBody2 || content.es.introText2;
        content.es.introButtonText = content.es.introButton || content.es.introButtonText;
        content.es.introModalTitle = content.es.introPopupHeadline || content.es.introModalTitle;
        content.es.introModalText = content.es.introPopupBody || content.es.introModalText;
        content.es.experienceSubtitle = content.es.destinationsSubtitle || content.es.experienceSubtitle;
        content.es.experienceTitle = content.es.destinationsHeadline || content.es.experienceTitle;
        content.es.quoteSubtitle = content.es.testimonialsSubtitle || content.es.quoteSubtitle;
        content.es.quoteTitle = content.es.testimonialsHeadline || content.es.quoteTitle;
        content.es.mosaicTitle = content.es.galleryHeadline || content.es.mosaicTitle;
        content.es.faqSubtitle = content.es.faqSubtitle;
        content.es.faqTitle = content.es.faqHeadline || content.es.faqTitle;
        content.es.ctaTitle = content.es.ctaHeadline || content.es.ctaTitle;
        content.es.ctaText = content.es.ctaSubtext || content.es.ctaText;
        content.es.ctaButtonText = content.es.ctaButton || content.es.ctaButtonText;
      }
    }
    
    if (row.id === 'contact_page') {
      content.title = content.headline || content.title;
      content.labels = content.labels || {};
      content.labels.name = content.formName || content.labels.name;
      content.labels.email = content.formEmail || content.labels.email;
      content.labels.phone = content.formPhone || content.labels.phone;
      content.labels.subject = content.formSubject || content.labels.subject;
      content.labels.comment = content.formComment || content.labels.comment;
      content.labels.button = content.formButton || content.labels.button;
    }
    if (row.id === 'contact_page_es') {
      content.title = content.headline || content.title;
      content.labels = content.labels || {};
      content.labels.name = content.formName || content.labels.name;
      content.labels.email = content.formEmail || content.labels.email;
      content.labels.phone = content.formPhone || content.labels.phone;
      content.labels.subject = content.formSubject || content.labels.subject;
      content.labels.comment = content.formComment || content.labels.comment;
      content.labels.button = content.formButton || content.labels.button;
    }

    if (row.id === 'legal_page' || row.id === 'privacy_page') {
      content.title = content.headline || content.title;
    }
    if (row.id === 'legal_page_es' || row.id === 'privacy_page_es') {
      content.title = content.headline || content.title;
      // Also write them into title_es and content_es inside the english object just in case the Client expects that structure
      const enRowId = row.id.replace('_es', '');
      const enRow = allContent.find(r => r.id === enRowId);
      if (enRow) {
        enRow.content = enRow.content || {};
        enRow.content.title_es = content.headline || content.title;
        enRow.content.content_es = content.content;
        enRow.content.rich_text_es = content.rich_text;
      }
    }

    const { error } = await supabase.from('site_content').upsert({ id: row.id, content: content });
    if (error) {
      console.error(`Error updating ${row.id}`, error);
    } else {
      console.log(`${row.id} structure fixed.`);
    }
  }
}
run();
