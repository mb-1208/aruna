import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  const baseUrl = 'https://arunatravelstudio.com';
  const now = new Date();

  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/travel', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/retreats', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/legal', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  ];

  const languages = ['en', 'es'];
  const sitemapEntries = [];

  // Generate static page entries for both EN and ES
  for (const lang of languages) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  // Fetch dynamic products (Retreats & Services)
  try {
    const { data: products } = await supabase.from('products').select('slug, type, updated_at');
    if (products && products.length > 0) {
      for (const prod of products) {
        const routePrefix = prod.type === 'service' ? 'services' : 'retreats';
        for (const lang of languages) {
          sitemapEntries.push({
            url: `${baseUrl}/${lang}/${routePrefix}/${prod.slug}`,
            lastModified: prod.updated_at ? new Date(prod.updated_at) : now,
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    }
  } catch (err) {
    console.error('[Sitemap generation error]:', err);
  }

  return sitemapEntries;
}
