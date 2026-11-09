import { supabase } from "@/lib/supabase";
import {
  SITE_URL,
  SITE_NAME,
  resolveHomeTitle,
  resolveHomeDescription,
  buildAlternates,
} from "@/lib/seo";
import HomeClient from "./HomeClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "global_settings")
    .single();
  const globalContent = data?.content || {};

  const homeTitle = resolveHomeTitle(globalContent?.title?.[lang], lang);
  const homeDescription = resolveHomeDescription(
    globalContent?.description?.[lang],
    lang
  );

  return {
    title: {
      absolute: homeTitle,
    },
    description: homeDescription,
    alternates: buildAlternates(lang, ""),
    openGraph: {
      title: homeTitle,
      description: homeDescription,
      url: `${SITE_URL}/${lang}`,
      siteName: SITE_NAME,
      locale: lang === "es" ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function Home() {
  const { data } = await supabase
    .from("site_content")
    .select("id, content")
    .in("id", ["home_page", "home_page_es"]);
  const enContent = data?.find((d) => d.id === "home_page")?.content || {};
  const esContent = data?.find((d) => d.id === "home_page_es")?.content || {};
  const content = { ...enContent, es: esContent };

  return <HomeClient content={content} />;
}
