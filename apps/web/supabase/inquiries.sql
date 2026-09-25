-- Contact inquiries. Run once in the Supabase SQL Editor.
-- Local and Vercel Preview write staging_inquiries.
-- Vercel Production writes production_inquiries.
-- Visitors may insert only. They cannot read, update, or delete rows.

create table if not exists public.staging_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('web', 'mobile')),
  services text[] not null default '{}',
  budget text,
  project_cycle text,
  full_name text not null,
  contact text not null,
  looking_to_build text not null,
  project_details text
);

create table if not exists public.production_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('web', 'mobile')),
  services text[] not null default '{}',
  budget text,
  project_cycle text,
  full_name text not null,
  contact text not null,
  looking_to_build text not null,
  project_details text
);

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
