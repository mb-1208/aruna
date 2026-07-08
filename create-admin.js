const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Role Key in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const email = 'admin@aruna.com';
  const password = 'password123';

  console.log(`Creating user ${email}...`);

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Aruna Admin' }
  });

  if (error) {
    console.error("Error creating user:", error.message);
  } else {
    console.log("User created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
  }
}

createAdmin();
