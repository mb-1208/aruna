-- 1. Recreate site_content with flexible JSONB
DROP TABLE IF EXISTS site_content CASCADE;

CREATE TABLE site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert global_settings defaults
INSERT INTO site_content (id, content) VALUES (
  'global_settings',
  '{
    "navbar": {
      "en": {
        "travel": "Travel",
        "retreats": "Retreats",
        "services": "Services",
        "about": "About",
        "reviews": "Reviews",
        "faq": "FAQ",
        "destinations": "Destinations",
        "gallery": "Gallery"
      }
    },
    "footer": {
      "en": {
        "description": "Aruna brings you to exotic destinations with a personal, refined touch.",
        "theCompany": "The Company",
        "stayConnected": "Stay Connected",
        "newsletterText": "Join our newsletter for exclusive travel tips and early access to our curated retreats.",
        "emailPlaceholder": "Email",
        "subscribe": "Subscribe",
        "copyright": "© 2026 Aruna. All rights reserved.",
        "legal": "Legal",
        "privacy": "Privacy Policy"
      }
    },
    "promo": {
      "en": {
        "heading": "Get 10% off on your first trip",
        "description": "Become a part of our community and be the first to get notified about new destinations",
        "emailPlaceholder": "E-mail",
        "button": "Sign Up Now"
      }
    }
  }'::jsonb
);

-- Insert home_page defaults
INSERT INTO site_content (id, content) VALUES (
  'home_page',
  '{
    "travelTitle": "Travel",
    "travelButton": "View",
    "retreatsTitle": "Retreats",
    "retreatsButton": "View"
  }'::jsonb
);

-- Insert travel_page defaults
INSERT INTO site_content (id, content) VALUES (
  'travel_page',
  '{
    "heroTitle": "Explore the Unseen",
    "services": [
      {"title": "Service A", "subtitle": "Explore"},
      {"title": "Service B", "subtitle": "Explore"},
      {"title": "Service C", "subtitle": "Explore"}
    ],
    "aboutSubtitle": "DISCOVER",
    "aboutTitle": "Our Mission",
    "aboutText": "We provide the best travel experiences.",
    "aboutQuote": "Travel far, travel wide.",
    "testimonialsSubtitle": "TESTIMONIALS",
    "testimonialsTitle": "What our guests say",
    "faqSubtitle": "FAQ",
    "faqTitle": "Got questions?",
    "faqItems": [
      {"question": "How to book?", "answer": "Contact us."}
    ],
    "ctaTitle": "Ready for your next adventure?",
    "ctaText": "Book now."
  }'::jsonb
);

-- Insert retreats_page defaults
INSERT INTO site_content (id, content) VALUES (
  'retreats_page',
  '{
    "heroTitle": "Find Inner Peace",
    "introSubtitle": "WELCOME",
    "introTitle": "To Aruna Retreats",
    "experienceSubtitle": "THE EXPERIENCE",
    "experienceTitle": "Our Destinations",
    "quoteSubtitle": "TESTIMONIALS",
    "quoteTitle": "Words from our guests",
    "faqSubtitle": "FAQ",
    "faqTitle": "What you need to know",
    "faqItems": [
      {"question": "What is included?", "answer": "Everything."}
    ],
    "ctaTitle": "Join us today",
    "ctaText": "Spaces are limited."
  }'::jsonb
);

-- 2. Add Spanish columns to destinations
ALTER TABLE retreats_destinations ADD COLUMN IF NOT EXISTS title_es text;
ALTER TABLE retreats_destinations ADD COLUMN IF NOT EXISTS date_es text;
ALTER TABLE retreats_destinations ADD COLUMN IF NOT EXISTS description_es text;

-- 3. Add Spanish columns to reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS quote_es text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS location_es text;

-- Allow public read access to site_content
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read site content" ON site_content;
CREATE POLICY "Public can read site content" ON site_content FOR SELECT USING (true);
