# showcase-app

Next.js monorepo (web + admin)

pnpm + Turborepo monorepo:

| App | Path | Role | Local |
|---|---|---|---|
| **web** | `apps/web` | Landing page (Next.js + MUI + Supabase client) | http://localhost:3000 |
| **admin** | `apps/admin` | Back office (default Next.js stub) | http://localhost:3001 |

**Stack:** Next.js on **Vercel** · backend on **Supabase** (one project for both apps).

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 12+
- Accounts: [GitHub](https://github.com), [Vercel](https://vercel.com), [Supabase](https://supabase.com)

## Local setup

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env with your Supabase URL + publishable key

pnpm dev          # web on :3000
pnpm dev:admin    # admin on :3001
```

Other scripts:

```bash
pnpm build        # build all apps
pnpm lint
pnpm --filter web build
pnpm --filter admin build
```

### Supabase env (web)

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API → publishable key |
| `NEXT_PUBLIC_INQUIRY_TABLE` | `staging_inquiries` locally and on Vercel Preview; `production_inquiries` on Vercel Production |

Use **one** Supabase project for `web` and (later) `admin`. Do not commit `.env`.

Browser client helper: `apps/web/lib/supabase/client.ts` (`createBrowserClient()`).

### Contact form tables

Desktop and mobile submissions share one table per environment. A `source` column is `web` or `mobile`.

1. Open the Supabase project → **SQL Editor** → New query.
2. Paste and run [apps/web/supabase/inquiries.sql](apps/web/supabase/inquiries.sql).
3. Table Editor should list `staging_inquiries` and `production_inquiries`.

The script creates both tables, turns on row level security, and allows anonymous insert only. Visitors cannot read other rows. The publishable key cannot create tables, so this SQL step is manual.

## Production: Vercel (web)

1. Push this repo to GitHub.
2. Vercel → **Add New Project** → import the repo.
3. Set **Root Directory** to `apps/web` (important for monorepo).
4. Framework Preset: Next.js (auto).
5. Install / build (defaults usually work with pnpm). If needed:
   - Install Command: `pnpm install`
   - Build Command: `cd ../.. && pnpm turbo build --filter=web`  
     or leave Vercel’s detected Next.js build for `apps/web`.
6. Environment Variables:
   - Production and Preview: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Production only: `NEXT_PUBLIC_INQUIRY_TABLE` = `production_inquiries`
   - Preview: `NEXT_PUBLIC_INQUIRY_TABLE` = `staging_inquiries`
7. Deploy → open `*.vercel.app`.

### First deploy checklist

- [ ] GitHub repo created and code pushed
- [ ] Supabase project created; URL + anon key copied
- [ ] Vercel project Root Directory = `apps/web`
- [ ] Supabase URL, publishable key, and `NEXT_PUBLIC_INQUIRY_TABLE` set in Vercel (Preview = staging, Production = production)
- [ ] Deploy succeeds; homepage loads (MUI button visible)
- [ ] (Optional) Custom domain later in Vercel

### Admin on Vercel (later)

Create a **second** Vercel project from the same repo:

- Root Directory: `apps/admin`
- Same Supabase env vars when admin needs the backend

## Repo layout

```text
/
├── apps/
│   ├── web/       # landing (MUI + Supabase scaffold)
│   └── admin/     # admin stub
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```
