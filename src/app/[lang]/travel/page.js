import { supabase } from "@/lib/supabase";
import {
  SITE_URL,
  SITE_NAME,
  buildAlternates,
  getBreadcrumbSchema,
  getFaqSchema,
  serializeJsonLd,
} from "@/lib/seo";
import TravelClient from "./TravelClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isEs = lang === "es";

  const title = isEs
    ? "Diseño de Viajes a Medida en Bali"
    : "Bespoke Travel Design in Bali";
  const description = isEs
    ? "Explora las mejores experiencias de viaje curadas con Aruna Travel Studio en Bali. Itinerarios personalizados, villas privadas y conserjería."
    : "Explore bespoke travel design and curated journeys in Bali with Aruna Travel Studio. Personalized itineraries, private villas, and dedicated concierge.";

  return {
    title,
    description,
    alternates: buildAlternates(lang, "/travel"),
    openGraph: {
      title: `${title} - ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/${lang}/travel`,
      siteName: SITE_NAME,
      locale: isEs ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function TravelPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";
  const isEs = lang === "es";

  const { data } = await supabase
    .from("site_content")
    .select("id, content")
    .in("id", ["travel_page", "travel_page_es"]);
  const enContent = data?.find((d) => d.id === "travel_page")?.content || {};
  const esContent = data?.find((d) => d.id === "travel_page_es")?.content || {};

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true });
  const { data: servicesData } = await supabase
    .from("products")
    .select("*")
    .eq("type", "service")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  const content = {
    ...enContent,
    es: esContent,
    reviews: reviewsData || [],
    servicesData: servicesData || [],
  };

  const activeContent = isEs ? { ...enContent, ...esContent } : enContent;
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: SITE_NAME, url: `${SITE_URL}/${lang}` },
    {
      name: isEs ? "Diseño de Viajes en Bali" : "Bespoke Travel Design in Bali",
      url: `${SITE_URL}/${lang}/travel`,
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
      <TravelClient initialContent={content} />
    </>
  );
}
