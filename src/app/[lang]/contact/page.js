import { supabase } from "@/lib/supabase";
import ContactClient from "@/components/ContactClient";

export const metadata = {
  title: "Contact Us - Aruna",
  description: "Get in touch with Aruna Retreats.",
};

export default async function ContactPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  // Always fetch English as base, then override with ES if needed
  const { data: allData } = await supabase
    .from('site_content')
    .select('id, content')
    .in('id', ['contact_page', 'contact_page_es']);

  const enContent = allData?.find(d => d.id === 'contact_page')?.content || {};
  const esContent = allData?.find(d => d.id === 'contact_page_es')?.content || {};

  // For ES, we merge EN and ES, so missing images/fields in ES fall back to EN
  let data = enContent;
  if (lang === 'es') {
    data = { ...enContent, ...esContent };
  }

  return <ContactClient data={data} />;
}
