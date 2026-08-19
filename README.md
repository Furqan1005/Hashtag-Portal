# Estrella Jewels — B2B Ordering Portal

Next.js (App Router) + TypeScript + Tailwind + Supabase.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — already populated from the connected project.
- `SUPABASE_SERVICE_ROLE_KEY` — required for the Showroom Portal (it reads/writes via the service role instead of a Supabase Auth session). Get it from Supabase dashboard → Project Settings → API → service_role key. **Never commit this or expose it to the client.**
- `SHOWROOM_SESSION_SECRET` — a random secret signing the showroom staff session cookie. A dev value is pre-filled; generate a fresh one for production (`openssl rand -hex 32`).

```bash
npm run dev
```

## Two portals

- `/` — landing page, picks between the two portals below.
- `/business/*` — Business Portal. Supabase Auth (email/password). Sign up from `/auth/login` to create the first `business_owner` account.
- `/showroom/*` — Showroom Portal. PIN-only, no Supabase Auth account — gated by a signed session cookie (see `proxy.ts` and `lib/auth/showroom-session.ts`). Demo staff seeded in the database:

  | Staff | PIN |
  |---|---|
  | Maya Lin | 1234 |
  | Diego Alvarez | 2580 |
  | Priya Nair | 4821 |
  | Sofia Marchetti | 1357 |

  **Rotate or remove these before a real launch.**

## Data

Schema and RLS policies live in Supabase (project `supabase-indigo-village`), applied via migrations through the Supabase MCP connector — there's no local `supabase/migrations` folder to run. `lib/types/database.types.ts` is generated from the live schema; regenerate it after any schema change.

The catalogue is seeded with 28 sample designs across all 7 categories for development. Replace with the real catalogue (and real product photography — `components/brand/photo-placeholder.tsx` is a gradient placeholder standing in until Supabase Storage assets are wired up) before launch.

## Deploy

Deploy target is Vercel. Set the same environment variables there (`SUPABASE_SERVICE_ROLE_KEY` as a server-only/encrypted variable).
