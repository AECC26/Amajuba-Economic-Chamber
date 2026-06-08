<div align="center">
  <img width="240" height="240" alt="Amajuba Economic Chamber Logo" src="/logo.jpg" />
</div>

# Amajuba Economic Chamber — Web App

This repository contains the front-end for the Amajuba Economic Chamber of Commerce website and member portal.

Key details
- **Registration number:** 2026 / 354235 / 08
- **Location:** Amajuba District, KwaZulu-Natal, South Africa
- **Contact:** amajubaeconomicchamber.office@gmail.com | 067 198 4100 / 068 334 1826

Running locally

Prerequisites:
- Node.js (LTS recommended)

1. Install dependencies

```bash
npm install
```

2. Create a `.env.local` file in the repository root and provide the required variables (see `.env.example`):

- `VITE_TOGETHER_API_KEY` — (optional) Together AI / LLM API key for chat
- `VITE_TOGETHER_MODEL` — model identifier (choose specific AI model)
- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key
- `VITE_SUPABASE_REGISTRATIONS_TABLE` — table name ('your registrations table`)
- `VITE_SUPABASE_STORAGE_BUCKET` — storage bucket ('your storage bucket`)
- `VITE_APP_URL` — application URL used for redirects (e.g. `http://localhost:3000`)

3. Start the dev server

```bash
npm run dev
```

Logo guidance

- Place the site logo at `/public/logo.jpg`. The app falls back to an inline icon if the image is missing.
- Use a square PNG or JPG (recommended 512x512) with a transparent or white background.

License & notes

This project is maintained by the Amajuba Economic Chamber. The canonical registration number is shown above and should not be changed in app copy or footer.

