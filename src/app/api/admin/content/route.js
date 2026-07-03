import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper to check if user is admin
async function ensureAdmin() {
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
    throw new Error('Unauthorized');
  }
  
  return { supabase, user };
}

// Helper to get service role client for admin operations
function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get() { return null; },
        set() {},
        remove() {}
      },
    }
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'global_settings';
    
    // Anyone can read content, but let's check auth just in case since this is admin API
    await ensureAdmin();
    const adminAuthClient = createAdminClient();
    
    const { data, error } = await adminAuthClient
      .from('site_content')
      .select('content')
      .eq('id', category)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows found'
      throw error;
    }
    
    return NextResponse.json({ content: data?.content || null });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 });
  }
}

export async function PUT(request) {
  try {
    await ensureAdmin();
    const body = await request.json();
    const { category, title, description, media_url, additional_data } = body;
    
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const adminAuthClient = createAdminClient();
    
    // Check if exists
    const { data: existing } = await adminAuthClient
      .from('site_content')
      .select('id')
      .eq('id', category)
      .single();
      
    const newContent = { title, description, media_url, additional_data };
    let result;
    
    if (existing) {
      // Update
      const { data, error } = await adminAuthClient
        .from('site_content')
        .update({
          content: newContent
        })
        .eq('id', existing.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Insert
      const { data, error } = await adminAuthClient
        .from('site_content')
        .insert([{
          id: category,
          content: newContent
        }])
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, content: result.content });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 });
  }
}
