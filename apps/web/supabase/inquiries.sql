-- Contact inquiries. Run in the Supabase SQL Editor.
-- Local and Vercel Preview write staging_inquiries.
-- Vercel Production writes production_inquiries.
-- Visitors may insert only. They cannot read, update, or delete rows.
-- Signed-in back-office users may select rows. Re-running this file keeps existing rows.

create table if not exists public.staging_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('web', 'mobile')),
  services text[] not null default '{}',
  budget text,
  project_cycle text,
  full_name text not null,
  contact text,
  looking_to_build text,
  project_details text,
  telegram text,
  service text,
  brand_name text,
  region text
);

create table if not exists public.production_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('web', 'mobile')),
  services text[] not null default '{}',
  budget text,
  project_cycle text,
  full_name text not null,
  contact text,
  looking_to_build text,
  project_details text,
  telegram text,
  service text,
  brand_name text,
  region text
);

-- Existing databases keep their rows. These statements add the desktop fields
-- and let new web rows leave the old contact columns empty.
alter table public.staging_inquiries add column if not exists telegram text;
alter table public.staging_inquiries add column if not exists service text;
alter table public.staging_inquiries add column if not exists brand_name text;
alter table public.staging_inquiries add column if not exists region text;
alter table public.staging_inquiries alter column contact drop not null;
alter table public.staging_inquiries alter column looking_to_build drop not null;

alter table public.production_inquiries add column if not exists telegram text;
alter table public.production_inquiries add column if not exists service text;
alter table public.production_inquiries add column if not exists brand_name text;
alter table public.production_inquiries add column if not exists region text;
alter table public.production_inquiries alter column contact drop not null;
alter table public.production_inquiries alter column looking_to_build drop not null;

alter table public.staging_inquiries enable row level security;
alter table public.production_inquiries enable row level security;

grant insert on public.staging_inquiries to anon, authenticated;
grant insert on public.production_inquiries to anon, authenticated;

drop policy if exists "public can insert staging inquiries" on public.staging_inquiries;
create policy "public can insert staging inquiries"
  on public.staging_inquiries
  for insert
  to anon, authenticated
  with check (source in ('web', 'mobile'));

drop policy if exists "public can insert production inquiries" on public.production_inquiries;
create policy "public can insert production inquiries"
  on public.production_inquiries
  for insert
  to anon, authenticated
  with check (source in ('web', 'mobile'));

grant select on public.staging_inquiries to authenticated;
grant select on public.production_inquiries to authenticated;

drop policy if exists "authenticated can read staging inquiries" on public.staging_inquiries;
create policy "authenticated can read staging inquiries"
  on public.staging_inquiries
  for select
  to authenticated
  using (true);

drop policy if exists "authenticated can read production inquiries" on public.production_inquiries;
create policy "authenticated can read production inquiries"
  on public.production_inquiries
  for select
  to authenticated
  using (true);
