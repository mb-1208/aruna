"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

export async function saveSiteContent(id, content) {
  await verifyAdminAuth();
  const { error } = await supabaseAdmin.from('site_content').upsert({ id, content });
  if (error) throw new Error(error.message);
  
  // Revalidate to show changes immediately in Next.js (On-Demand Revalidation)
  if (id === 'home_page' || id === 'home_page_es') { revalidatePath('/en'); revalidatePath('/es'); }
  if (id === 'travel_page' || id === 'travel_page_es') { revalidatePath('/en/travel'); revalidatePath('/es/travel'); }
  if (id === 'retreats_page' || id === 'retreats_page_es') { revalidatePath('/en/retreats'); revalidatePath('/es/retreats'); }
  if (id === 'contact_page' || id === 'contact_page_es') { revalidatePath('/en/contact'); revalidatePath('/es/contact'); }
  if (id === 'legal_page' || id === 'legal_page_es') { revalidatePath('/en/legal'); revalidatePath('/es/legal'); }
  if (id === 'privacy_page' || id === 'privacy_page_es') { revalidatePath('/en/privacy'); revalidatePath('/es/privacy'); }
  if (id === 'global_settings') {
    revalidatePath('/', 'layout'); // Clears cache for all pages
  }
  
  return true;
}

export async function fetchLeads() {
  await verifyAdminAuth();
  const { data, error } = await supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function saveProducts(products) {
  await verifyAdminAuth();
  for (const prod of products) {
    if (prod.id) {
      // Update existing
      const { error } = await supabaseAdmin.from('products')
        .update({
          title: prod.title,
          date: prod.date,
          description: prod.description,
          slug: prod.slug,
          type: prod.type,
          content: prod.content
        })
        .eq('id', prod.id);
      if (error) throw new Error(error.message);
    } else {
      // Insert new
      const { error } = await supabaseAdmin.from('products')
        .insert({
          title: prod.title,
          date: prod.date,
          description: prod.description,
          slug: prod.slug,
          type: prod.type,
          content: prod.content
        });
      if (error) throw new Error(error.message);
    }

    if (prod.slug) {
      if (prod.type === 'retreat') {
        revalidatePath(`/en/retreats/${prod.slug}`);
        revalidatePath(`/es/retreats/${prod.slug}`);
      } else {
        revalidatePath(`/en/services/${prod.slug}`);
        revalidatePath(`/es/services/${prod.slug}`);
      }
    }
  }
  revalidatePath('/en/retreats');
  revalidatePath('/es/retreats');
  revalidatePath('/en/travel');
  revalidatePath('/es/travel');
  return true;
}

export async function deleteProduct(id) {
  await verifyAdminAuth();
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/en/retreats');
  revalidatePath('/es/retreats');
  revalidatePath('/en/travel');
  revalidatePath('/es/travel');
  return true;
}

export async function saveReviews(reviews) {
  await verifyAdminAuth();
  const upsertData = reviews.map(r => ({
    id: r.id,
    category: r.category,
    name: r.name,
    name_es: r.name_es,
    quote: r.quote,
    quote_es: r.quote_es,
    location: r.location,
    location_es: r.location_es,
    bg_image: r.bgImage || r.bg_image,
    avatar: r.avatar
  }));

  const { error: upsertError } = await supabaseAdmin.from('reviews').upsert(upsertData);
  if (upsertError) throw new Error(upsertError.message);

  // Delete reviews that are not in the provided list
  if (reviews.length > 0) {
    const keepIds = reviews.map(r => r.id);
    const { error: deleteError } = await supabaseAdmin.from('reviews').delete().not('id', 'in', `(${keepIds.join(',')})`);
    if (deleteError) console.error("Failed to delete removed reviews:", deleteError);
  } else {
    // If list is empty, delete all reviews
    await supabaseAdmin.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }
  revalidatePath('/en/travel');
  revalidatePath('/es/travel');
  revalidatePath('/en/retreats');
  revalidatePath('/es/retreats');
  return true;
}
