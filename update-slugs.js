import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');      // Replace multiple - with single -
}

async function updateSlugs() {
  const { data: products } = await supabase.from('products').select('*')
  
  if (products) {
    for (const product of products) {
      const newSlug = slugify(product.title);
      if (newSlug && product.slug !== newSlug) {
        console.log(`Updating ${product.slug} -> ${newSlug}`);
        const { error } = await supabase.from('products').update({ slug: newSlug }).eq('id', product.id);
        if (error) {
          console.error(`Error updating ${product.id}:`, error);
        }
      }
    }
    console.log("Successfully updated all slugs!");
  }
}

updateSlugs()
