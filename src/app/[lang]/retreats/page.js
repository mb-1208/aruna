import { supabase } from "@/lib/supabase";
import {
  SITE_URL,
  SITE_NAME,
  buildAlternates,
  getBreadcrumbSchema,
  getFaqSchema,
  serializeJsonLd,
} from "@/lib/seo";
import RetreatsClient from "./RetreatsClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isEs = lang === "es";

  const title = isEs
    ? "Retiros Transformadores en Bali"
    : "Transformative Bali Retreats";
  const description = isEs
    ? "Reconecta contigo en total serenidad con los retiros de bienestar y transformación de Aruna Travel Studio en Bali."
    : "Reconnect with yourself in total serenity with Aruna Travel Studio's transformative wellness and women retreats in Bali.";

  return {
    title,
    description,
    alternates: buildAlternates(lang, "/retreats"),
    openGraph: {
      title: `${title} - ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/${lang}/retreats`,
      siteName: SITE_NAME,
      locale: isEs ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function RetreatsPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";
  const isEs = lang === "es";

  const { data } = await supabase
    .from("site_content")
    .select("id, content")
    .in("id", ["retreats_page", "retreats_page_es"]);

  const enContent = data?.find((d) => d.id === "retreats_page")?.content || {};
  const esContent = data?.find((d) => d.id === "retreats_page_es")?.content || {};

  const { data: destinationsData } = await supabase
    .from("products")
    .select("*")
    .eq("type", "retreat")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true });

  const content = {
    ...enContent,
    es: esContent,
    destinations: destinationsData || [],
    reviews: reviewsData || [],
  };

  const activeContent = isEs ? { ...enContent, ...esContent } : enContent;
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: SITE_NAME, url: `${SITE_URL}/${lang}` },
    {
      name: isEs ? "Retiros en Bali" : "Transformative Bali Retreats",
      url: `${SITE_URL}/${lang}/retreats`,
    },
  ]);
  const faqJsonLd = getFaqSchema(activeContent?.faqItems || []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd),
        }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(faqJsonLd),
          }}
        />
      )}
      <RetreatsClient initialContent={content} />
    </>
  );
}
