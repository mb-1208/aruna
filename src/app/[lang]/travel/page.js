import { supabase } from "@/lib/supabase";
import TravelClient from "./TravelClient";

export const metadata = {
  title: "Travel Experiences - Aruna",
  description: "Explore the best curated travel experiences with Aruna in Bali.",
};

export default async function TravelPage() {
  const { data } = await supabase.from('site_content').select('id, content').in('id', ['travel_page', 'travel_page_es']);
  const enContent = data?.find(d => d.id === 'travel_page')?.content || {};
  const esContent = data?.find(d => d.id === 'travel_page_es')?.content || {};
  
  const { data: reviewsData } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
  const { data: servicesData } = await supabase.from('products').select('*').eq('type', 'service').order('created_at', { ascending: true }).order('id', { ascending: true });
  
  const content = { ...enContent, es: esContent, reviews: reviewsData || [], servicesData: servicesData || [] };

  return <TravelClient initialContent={content} />;
}
