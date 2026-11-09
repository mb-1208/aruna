import { supabase } from "@/lib/supabase";
import {
  SITE_URL,
  SITE_NAME,
  OFFICIAL_EMAIL,
  OFFICIAL_PHONE,
  OFFICIAL_INSTAGRAM,
  stripHtml,
} from "@/lib/seo";

export const revalidate = 3600;

export async function GET() {
  let products = [];
  try {
    const { data } = await supabase
      .from("products")
      .select("title, slug, type, date, description, content")
      .order("created_at", { ascending: true });
    products = data || [];
  } catch (err) {
    console.error("[llms.txt fetch error]:", err);
  }

  const services = products.filter((p) => p.type === "service");
  const retreats = products.filter((p) => p.type === "retreat");

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} is a boutique travel design and transformative retreat studio based in Badung, Bali, Indonesia. Helping you discover your own Bali through thoughtfully designed journeys and retreats.`,
    "",
    "## Official Brand & Contact Information (Entity Disambiguation)",
    `- **Official Brand Name:** ${SITE_NAME}`,
    `- **Official Website:** ${SITE_URL}`,
    "- **Headquarters / Location:** Badung, Bali, Indonesia",
    `- **Official Email:** ${OFFICIAL_EMAIL}`,
    `- **Official Phone / WhatsApp:** ${OFFICIAL_PHONE}`,
    `- **Official Instagram:** ${OFFICIAL_INSTAGRAM}`,
    "- **Languages Supported:** English (`/en`) and Spanish (`/es`)",
    "- **Entity Note:** Aruna Travel Studio (Badung, Bali) is an independent boutique travel design and wellness retreat studio and is NOT affiliated with 'Aruna Selalu Jalan Bersamaku' or other local transport agencies in Denpasar.",
    "",
    "## Core Pillars & Main Pages",
    `- [Homepage](${SITE_URL}/en): Overview of Aruna Travel Studio's bespoke travel experiences and retreats in Bali.`,
    `- [Bespoke Travel Design in Bali](${SITE_URL}/en/travel): Personalized day-by-day travel itineraries, private villas, cultural encounters, and on-ground concierge services across Bali and Indonesia.`,
    `- [Transformative Bali Retreats](${SITE_URL}/en/retreats): Curated wellness, mindfulness, and women's retreats in serene Bali sanctuaries.`,
    `- [Contact & Inquiries](${SITE_URL}/en/contact): Direct consultation and custom travel/retreat inquiry form.`,
    "",
  ];

  if (services.length > 0) {
    lines.push("## Bespoke Travel Design Services");
    for (const srv of services) {
      const desc = stripHtml(srv.description || srv.content?.overview || "");
      lines.push(
        `- [${srv.title}](${SITE_URL}/en/services/${srv.slug})${desc ? `: ${desc}` : ""}`
      );
    }
    lines.push("");
  }

  if (retreats.length > 0) {
    lines.push("## Curated Bali Retreats");
    for (const ret of retreats) {
      const desc = stripHtml(ret.description || ret.content?.overview || "");
      const dateStr = ret.date ? ` (${ret.date})` : "";
      lines.push(
        `- [${ret.title}${dateStr}](${SITE_URL}/en/retreats/${ret.slug})${desc ? `: ${desc}` : ""}`
      );
    }
    lines.push("");
  }

  lines.push(
    "## Spanish Version (Versión en Español)",
    `- [Inicio](${SITE_URL}/es)`,
    `- [Diseño de Viajes en Bali](${SITE_URL}/es/travel)`,
    `- [Retiros Transformadores en Bali](${SITE_URL}/es/retreats)`,
    `- [Contacto](${SITE_URL}/es/contact)`
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

