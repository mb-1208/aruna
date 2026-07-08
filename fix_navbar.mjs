import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: contentData } = await supabase.from('site_content').select('*').eq('id', 'global_settings').single();
  
  if (contentData) {
    let g = contentData.content;
    
    // Fix EN navbar structure
    if (g.navbar && g.navbar.en) {
      const enNav = g.navbar.en;
      g.navbar.en = {
        travel: enNav.travel || "Travel Design",
        retreats: enNav.retreats || "Retreats",
        services: enNav.experiences || "Experiences",
        about: enNav.about || "About Aruna",
        reviews: enNav.testimonials || "Testimonials",
        faq: enNav.faq || "FAQ",
        destinations: enNav.destinations || "Destinations",
        gallery: enNav.gallery || "Gallery"
      };
    }

    // Fix ES navbar structure
    if (g.navbar && g.navbar.es) {
      const esNav = g.navbar.es;
      g.navbar.es = {
        travel: esNav.travel || "Viajes personalizados",
        retreats: esNav.retreats || "Retiros",
        services: esNav.experiences || "Experiencias",
        about: esNav.about || "Sobre Aruna",
        reviews: esNav.testimonials || "Testimonios",
        faq: esNav.faq || "Preguntas Frecuentes",
        destinations: esNav.destinations || "Destinos",
        gallery: esNav.gallery || "Galería"
      };
    }

    const { error } = await supabase.from('site_content').upsert({ id: 'global_settings', content: g });
    if (error) {
      console.error("Error updating", error);
    } else {
      console.log("Navbar structure fixed.");
    }
  }
}
run();
