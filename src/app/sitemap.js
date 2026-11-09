import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap() {
  const baseUrl = SITE_URL;
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/travel", priority: 0.8, changeFrequency: "weekly" },
    { path: "/retreats", priority: 0.8, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  ];

  const languages = ["en", "es"];
  const sitemapEntries = [];

  // Generate static page entries for both EN and ES with hreflang alternates
  for (const lang of languages) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route.path}`,
            es: `${baseUrl}/es${route.path}`,
          },
        },
      });
    }
  }

  // Fetch dynamic products (Retreats & Services)
  try {
    const { data: products } = await supabase
      .from("products")
      .select("slug, type, created_at")
      .order("created_at", { ascending: true });
    if (products && products.length > 0) {
      for (const prod of products) {
        if (!prod.slug) continue;
        const routePrefix = prod.type === "service" ? "services" : "retreats";
        for (const lang of languages) {
          sitemapEntries.push({
            url: `${baseUrl}/${lang}/${routePrefix}/${prod.slug}`,
            lastModified: prod.created_at ? new Date(prod.created_at) : now,
            changeFrequency: "weekly",
            priority: 0.8,
            alternates: {
              languages: {
                en: `${baseUrl}/en/${routePrefix}/${prod.slug}`,
                es: `${baseUrl}/es/${routePrefix}/${prod.slug}`,
              },
            },
          });
        }
      }
    }
  } catch (err) {
    console.error("[Sitemap generation error]:", err);
  }

  return sitemapEntries;
}
