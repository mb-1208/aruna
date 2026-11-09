import { supabase } from "@/lib/supabase";
import { SITE_URL, SITE_NAME, buildAlternates } from "@/lib/seo";
import LegalClient from "./LegalClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isEs = lang === "es";

  const title = isEs ? "Aviso Legal y Términos" : "Legal Terms & Conditions";
  const description = isEs
    ? "Términos y condiciones legales de Aruna Travel Studio en Bali."
    : "Legal terms and conditions for Aruna Travel Studio journeys and retreats in Bali.";

  return {
    title,
    description,
    alternates: buildAlternates(lang, "/legal"),
    openGraph: {
      title: `${title} - ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/${lang}/legal`,
      siteName: SITE_NAME,
      locale: isEs ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function LegalPage() {
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "legal_page")
    .single();
  const content = data?.content || {};

  return <LegalClient initialContent={content} />;
}
