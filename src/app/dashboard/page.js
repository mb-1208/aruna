import DashboardEditor from './DashboardEditor';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Aruna CMS",
};

export default async function DashboardPage() {
  // Fetch initial data
  const { data: contentData } = await supabase.from('site_content').select('*');
  const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: true }).order('id', { ascending: true });
  const { data: reviewData } = await supabase.from('reviews').select('*').order('category', { ascending: true }).order('sort_order', { ascending: true });
  
  // Use admin client for leads to bypass RLS (since this is private data)
  const { data: leadsData } = await supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false });

  const initialData = {
    content: contentData || [],
    products: productsData || [],
    reviews: reviewData || [],
    leads: leadsData || []
  };

  return (
    <main className="h-screen w-full overflow-hidden bg-gray-50 text-black font-sans flex">
      <DashboardEditor initialData={initialData} />
    </main>
  );
}
