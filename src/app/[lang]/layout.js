import { Inter, Playfair_Display, Questrial, Cormorant_Garamond, Allura } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
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
  const { data } = await supabase.from('site_content').select('content').eq('id', 'global_settings').single();
  const globalContent = data?.content || {};
  
  const siteTitle = globalContent?.title?.[lang] || "Aruna Travel Studio";
  const siteDescription = globalContent?.description?.[lang] || "Curating bespoke journeys and soulful retreats in Bali.";
  const ogImage = globalContent?.logo_url || "https://arunatravelstudio.com/og-image.jpg";

  return {
    metadataBase: new URL("https://arunatravelstudio.com"),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        es: "/es",
      },
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: `/${lang}`,
      siteName: "Aruna Travel Studio",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [ogImage],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: siteTitle,
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const { data } = await supabase.from('site_content').select('content').eq('id', 'global_settings').single();
  const globalContent = data?.content || {};

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${playfair.variable} ${questrial.variable} ${cormorant.variable} ${allura.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col m-0 aruna-public">
        <LanguageProvider globalContent={globalContent} lang={lang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
