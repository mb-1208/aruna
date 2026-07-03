import { Inter, Playfair_Display, Questrial } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import "../globals.css";

export const revalidate = 0;

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

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { data } = await supabase.from('site_content').select('content').eq('id', 'global_settings').single();
  const globalContent = data?.content || {};
  
  return {
    title: globalContent?.title?.[lang] || "Aruna - Travel & Retreats",
    description: globalContent?.description?.[lang] || "Aruna Travel and Retreats in Bali",
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const { data } = await supabase.from('site_content').select('content').eq('id', 'global_settings').single();
  const globalContent = data?.content || {};

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${playfair.variable} ${questrial.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col m-0 aruna-public">
        <LanguageProvider globalContent={globalContent} lang={lang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
