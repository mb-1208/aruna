import { Inter, Playfair_Display, Questrial, Cormorant_Garamond, Allura } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import {
  SITE_URL,
  SITE_NAME,
  resolveHomeTitle,
  resolveHomeDescription,
  getGlobalSchemaGraph,
  serializeJsonLd,
} from "@/lib/seo";
import "../globals.css";

export const revalidate = 300; // 5-minute ISR caching, instantly purged on CMS edit

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const questrial = Questrial({
  weight: "400",
  variable: "--font-questrial",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  subsets: ["latin"],
});

const allura = Allura({
  weight: "400",
  variable: "--font-allura",
  subsets: ["latin"],
});

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "global_settings")
    .single();
  const globalContent = data?.content || {};

  const siteTitle = resolveHomeTitle(globalContent?.title?.[lang], lang);
  const siteDescription = resolveHomeDescription(
    globalContent?.description?.[lang],
    lang
  );
  const ogImage =
    globalContent?.cta?.en?.image ||
    globalContent?.logo_url ||
    `${SITE_URL}/favicon.ico`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: `%s - ${SITE_NAME}`,
    },
    description: siteDescription,
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: `${SITE_URL}/${lang}`,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
      locale: lang === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: [ogImage],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: SITE_NAME,
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "global_settings")
    .single();
  const globalContent = data?.content || {};
  const globalJsonLd = getGlobalSchemaGraph(globalContent, lang);

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${playfair.variable} ${questrial.variable} ${cormorant.variable} ${allura.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col m-0 aruna-public">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(globalJsonLd),
          }}
        />
        <LanguageProvider globalContent={globalContent} lang={lang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
