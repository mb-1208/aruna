"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import DocumentLayout from "@/components/DocumentLayout";

export default function PrivacyClient({ initialContent }) {
  const { currentLang } = useLanguage();
  
  // Choose Spanish or English content based on language
  const content = currentLang === 'es' ? {
    title: initialContent.title_es || initialContent.title,
    content: initialContent.content_es || initialContent.content,
    rich_text: initialContent.rich_text_es || initialContent.rich_text,
    hero_image: initialContent.hero_image_es || initialContent.hero_image
  } : initialContent;

  return <DocumentLayout content={content} />;
}
