import { supabase } from '@/lib/supabase';
import PrivacyClient from './PrivacyClient';

export const metadata = {
  title: 'Privacy Policy - Aruna',
  description: 'Privacy policy and data handling for Aruna Travel and Retreats.',
};

export default async function PrivacyPage() {
  const { data } = await supabase.from('site_content').select('content').eq('id', 'privacy_page').single();
  const content = data?.content || {};

  return <PrivacyClient initialContent={content} />;
}
// Force refresh
