-- 1. Insert seed data for Contact, Legal, and Privacy pages
INSERT INTO site_content (id, content) VALUES (
  'contact_page',
  '{
    "title": "GET IN TOUCH",
    "labels": {
      "name": "Name",
      "email": "Email",
      "phone": "Phone",
      "subject": "Subject",
      "comment": "Comment",
      "button": "Send Message"
    }
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO site_content (id, content) VALUES (
  'legal_page',
  '{
    "title": "LEGAL CENTER",
    "content": [
      {
        "title": "1. Company Identity",
        "description": "For official correspondence and transparency, here are our business details:",
        "items": [
          "Registered Name: PT. XYZ Travel Indonesia",
          "Business Address: Full Office Address in Bali",
          "Business Registration (NIB): Insert Number",
          "Contact Email: legal@yourdomain.com"
        ]
      },
      {
        "title": "2. Important Disclaimers",
        "description": "By participating in our retreats, you acknowledge the following:",
        "items": [
          "Travel Risks & Insurance: While we prioritize safety, travel in Indonesia involves inherent risks...",
          "Physical & Mental Wellbeing: Our retreats may include physical activities...",
          "Force Majeure: We cannot be held liable for failure to perform our obligations..."
        ]
      },
      {
        "title": "3. Intellectual Property",
        "description": "All content found on this website—including photography, branding, retreat itineraries, and written copy—is the exclusive property of [Business Name] and is protected by international copyright laws. Unauthorized reproduction or use is strictly prohibited.",
        "items": []
      },
      {
        "title": "4. Get in Touch",
        "description": "If you have any questions regarding these documents, or if you need clarification on a specific policy, please reach out to us. We are happy to help.",
        "items": [
          "Legal Inquiries: legal@yourdomain.com",
          "Response Time: We aim to respond to all formal inquiries within 48 hours."
        ]
      }
    ]
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO site_content (id, content) VALUES (
  'privacy_page',
  '{
    "title": "PRIVACY POLICY",
    "content": [
      {
        "title": "1. What Information We Collect",
        "description": "To provide you with a seamless retreat experience, we collect only the information that is necessary. This includes:",
        "items": [
          "Identity Information: Full name, passport details (for local tourism requirements), date of birth, and nationality.",
          "Contact Information: Email address, phone number, and emergency contact details.",
          "Travel Preferences: Dietary restrictions, allergies, physical fitness levels, and accommodation preferences.",
          "Technical Data: Information about your device and how you interact with our website (via cookies)."
        ]
      },
      {
        "title": "2. How We Use Your Data",
        "description": "We do not use your data for anything other than fulfilling our commitment to you. Your data is used to:",
        "items": [
          "Process your booking and facilitate payment.",
          "Coordinate with our vendors (hotels, transportation, instructors) to ensure your accommodation and activities are prepared.",
          "Send you important pre-arrival information, retreat updates, and newsletters (only if you have opted in).",
          "Comply with Indonesian legal and immigration requirements."
        ]
      }
    ]
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;


-- 2. Alter retreats_destinations table
ALTER TABLE retreats_destinations ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE retreats_destinations ADD COLUMN IF NOT EXISTS content jsonb DEFAULT '{}'::jsonb;

-- Populate slugs based on existing links if slug is null
UPDATE retreats_destinations 
SET slug = REPLACE(link, '/retreats/', '') 
WHERE slug IS NULL AND link IS NOT NULL;

-- Make slug unique
-- We need to ensure slugs are unique. If there are duplicates, this might fail, but for a fresh DB it's fine.
-- Let's just add a unique constraint just in case.
ALTER TABLE retreats_destinations ADD CONSTRAINT retreats_destinations_slug_key UNIQUE (slug);
