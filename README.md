KEESH Dashboard

Minimal Next.js 14 + TypeScript + Tailwind app scaffold with Postgres DB integration.

Environment

- `DATABASE_URL` - Postgres connection string (Neon or any Postgres)
- `SHIPPO_API_TOKEN` - optional for Shippo integration
- `NEXT_PUBLIC_HOST` - optional base host for server-side fetches (e.g. https://your-deploy.vercel.app)

Database

Apply `sql/schema.sql` to your Postgres database (it requires `pgcrypto` extension for `gen_random_uuid`).

API

- POST /api/kits
- GET /api/kits
- GET /api/kits/:id
- POST /api/returns
- POST /api/shippo/webhook

Run locally

```bash
cd C:/Users/LaptopAdmin/keesh-tracker
npm install
npm run dev
```

Deployment

This project is Vercel-ready. Set `DATABASE_URL` and `SHIPPO_API_TOKEN` in Vercel environment variables.
