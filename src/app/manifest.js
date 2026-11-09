import { SITE_NAME, DEFAULT_SEO } from "@/lib/seo";

export default function manifest() {
  return {
    name: `${SITE_NAME} | Transformative Journeys & Retreats in Bali`,
    short_name: SITE_NAME,
    description: DEFAULT_SEO.en.description,
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#d18529",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
