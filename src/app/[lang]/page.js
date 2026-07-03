import { supabase } from '@/lib/supabase';
import HomeClient from './HomeClient';

export default async function Home() {
  const { data } = await supabase.from('site_content').select('id, content').in('id', ['home_page', 'home_page_es']);
  const enContent = data?.find(d => d.id === 'home_page')?.content || {};
  const esContent = data?.find(d => d.id === 'home_page_es')?.content || {};
  const content = { ...enContent, es: esContent };
  
  return <HomeClient content={content} />;
}
