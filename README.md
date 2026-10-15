# Aruna Travel Studio 🌿

A bespoke web platform and digital CMS ecosystem for **Aruna Travel Studio** (`arunatravelstudio.com`), combining luxury travel curation and mindful wellness retreats in Bali with an integrated, bilingual content management architecture.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions, On-Demand ISR)
- **Database & Storage:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security, Storage Buckets, Auth)
- **Styling:** Tailwind CSS & Vanilla CSS Animations
- **Email Delivery:** [Resend](https://resend.com/) API (Transactional notifications for inquiries, waitlists, and newsletter)
- **Languages:** Dual-language support (English `en` & Spanish `es`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or later
- npm or yarn or pnpm

### 2. Environment Setup
Duplicate `.env.example` to create your local environment file:

```bash
cp .env.example .env.local
```

Fill in the required values from your Supabase project and Resend account:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_TO_EMAIL`

### 3. Installation & Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
├── database/            # SQL migration & seed scripts
├── docs/                # Official system manuals & audit reports
├── public/              # Static public assets (logos, icons)
├── src/
│   ├── app/             # Next.js App Router (pages, api routes, dashboard)
│   ├── assets/          # Static brand images & WebP assets
│   ├── components/      # UI components & sections
│   ├── contexts/        # React context (LanguageContext)
│   ├── lib/             # Third-party service initializations (Supabase, Resend)
│   └── utils/           # Helper functions & server client factories
├── .env.example         # Environment template
└── package.json
```

---

## 📖 Documentation

For detailed administrative workflows, consult the documents in the `docs/` directory:
- [CMS Operations Manual](docs/PANDUAN_PENGGUNAAN_ARUNA_CMS.md)
- [Production Readiness Audit](docs/PRODUCTION_AUDIT.md)