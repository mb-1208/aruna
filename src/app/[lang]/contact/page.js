import { supabase } from "@/lib/supabase";
import {
  SITE_URL,
  SITE_NAME,
  buildAlternates,
  getBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo";
import ContactClient from "@/components/ContactClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isEs = lang === "es";

  const title = isEs ? "Contacto y Consultas" : "About & Contact";
  const description = isEs
    ? "Ponte en contacto con Aruna Travel Studio en Badung, Bali. Contáctanos al +62 877 4543 7915 o hello@arunatravelstudio.com."
    : "Get in touch with Aruna Travel Studio in Badung, Bali for bespoke travel design and retreats. Contact us at +62 877 4543 7915 or hello@arunatravelstudio.com.";

  return {
    title,
    description,
    alternates: buildAlternates(lang, "/contact"),
    openGraph: {
      title: `${title} - ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/${lang}/contact`,
      siteName: SITE_NAME,
      locale: isEs ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function ContactPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || "en";
  const isEs = lang === "es";

  // Always fetch English as base, then override with ES if needed
  const { data: allData } = await supabase
    .from("site_content")
    .select("id, content")
    .in("id", ["contact_page", "contact_page_es"]);

  const enContent = allData?.find((d) => d.id === "contact_page")?.content || {};
  const esContent =
    allData?.find((d) => d.id === "contact_page_es")?.content || {};

  // For ES, we merge EN and ES, so missing images/fields in ES fall back to EN
  let data = enContent;
  if (isEs) {
    data = { ...enContent, ...esContent };
  }

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: SITE_NAME, url: `${SITE_URL}/${lang}` },
    {
      name: isEs ? "Contacto" : "About & Contact",
      url: `${SITE_URL}/${lang}/contact`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd),
        }}
      />
      <ContactClient data={data} />
    </>
  );
}
