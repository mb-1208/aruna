import { supabase } from "@/lib/supabase";
import { SITE_URL, SITE_NAME, buildAlternates } from "@/lib/seo";
import PrivacyClient from "./PrivacyClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isEs = lang === "es";

  const title = isEs ? "Política de Privacidad" : "Privacy Policy";
  const description = isEs
    ? "Política de privacidad y tratamiento de datos de Aruna Travel Studio."
    : "Privacy policy and data handling for Aruna Travel Studio in Bali.";

  return {
    title,
    description,
    alternates: buildAlternates(lang, "/privacy"),
    openGraph: {
      title: `${title} - ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/${lang}/privacy`,
      siteName: SITE_NAME,
      locale: isEs ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function PrivacyPage() {
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "privacy_page")
    .single();
  const content = data?.content || {};

  return <PrivacyClient initialContent={content} />;
}
