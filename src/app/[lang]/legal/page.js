import { supabase } from '@/lib/supabase';
import LegalClient from './LegalClient';

export const metadata = {
  title: 'Legal Center - Aruna',
  description: 'Legal terms and conditions for Aruna Travel and Retreats.',
};

export default async function LegalPage() {
  const { data } = await supabase.from('site_content').select('content').eq('id', 'legal_page').single();
  const content = data?.content || {};

  return <LegalClient initialContent={content} />;
}
