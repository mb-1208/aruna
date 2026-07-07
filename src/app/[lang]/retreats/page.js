import { supabase } from '@/lib/supabase';
import RetreatsClient from './RetreatsClient';

export const metadata = {
  title: 'Retreats - Aruna',
  description: 'Reconnect with yourself in total serenity with Aruna Retreats.',
};

export default async function RetreatsPage() {
  const { data } = await supabase.from('site_content').select('id, content').in('id', ['retreats_page', 'retreats_page_es']);
  
  const enContent = data?.find(d => d.id === 'retreats_page')?.content || {};
  const esContent = data?.find(d => d.id === 'retreats_page_es')?.content || {};
  
  const { data: destinationsData } = await supabase.from('products').select('*').eq('type', 'retreat').order('created_at', { ascending: true }).order('id', { ascending: true });
  const { data: reviewsData } = await supabase.from('reviews').select('*').order('sort_order', { ascending: true });
  
  const content = { ...enContent, es: esContent, destinations: destinationsData || [], reviews: reviewsData || [] };

  return <RetreatsClient initialContent={content} />;
}
