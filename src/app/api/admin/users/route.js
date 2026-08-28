import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Middleware or helper to ensure the caller is an authenticated admin
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
  return user;
}

export async function GET(request) {
  try {
    await ensureAdmin();
    const adminAuthClient = createAdminClient();
    
    // Fetch users using the admin api
    const { data, error } = await adminAuthClient.auth.admin.listUsers();
    if (error) throw error;
    
    // Fetch roles from the profiles table (source of truth)
    const { data: profiles, error: profilesError } = await adminAuthClient
      .from('profiles')
      .select('id, role');
      
    if (profilesError) throw profilesError;
    
    // Merge database role into user metadata so the frontend sees the correct role
    const usersWithRoles = data.users.map(user => {
      const profile = profiles.find(p => p.id === user.id);
      return {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          role: profile?.role || 'editor' // Fallback to editor if not found
        }
      };
    });
    
    return NextResponse.json({ users: usersWithRoles });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 });
  }
}

export async function POST(request) {
  try {
    await ensureAdmin();
    const { email, password, full_name, role } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const assignedRole = role === 'owner' ? 'owner' : 'editor';

    const adminAuthClient = createAdminClient();
    
    const { data, error } = await adminAuthClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name || '',
        role: assignedRole
      }
    });
    
    if (error) throw error;
    
    // Also explicitly update the profiles table if the trigger created it
    await adminAuthClient
      .from('profiles')
      .update({ role: assignedRole })
      .eq('id', data.user.id);

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 });
  }
}

export async function DELETE(request) {
  try {
    await ensureAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const adminAuthClient = createAdminClient();
    
    const { data, error } = await adminAuthClient.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 });
  }
}

export async function PUT(request) {
  try {
    await ensureAdmin();
    const { id, full_name, role, password } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const assignedRole = role === 'owner' ? 'owner' : 'editor';
    const adminAuthClient = createAdminClient();
    
    // Prepare update payload
    const updatePayload = {
      user_metadata: {
        full_name: full_name || '',
        role: assignedRole
      }
    };

    // Include password only if it is provided
    if (password && password.trim() !== '') {
      updatePayload.password = password;
    }

    // Update Auth user
    const { data, error } = await adminAuthClient.auth.admin.updateUserById(
      id,
      updatePayload
    );
    
    if (error) throw error;
    
    // Update profiles table explicitly
    await adminAuthClient
      .from('profiles')
      .update({ 
        role: assignedRole,
        full_name: full_name || ''
      })
      .eq('id', id);

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 });
  }
}
