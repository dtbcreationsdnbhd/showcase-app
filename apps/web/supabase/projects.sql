-- Showcase projects. Run in the Supabase SQL Editor.
-- Local and Vercel Preview read and write staging_projects.
-- Vercel Production reads and writes production_projects.
-- Visitors may read rows. Signed-in back-office users may insert rows.
-- Images go in the public project-images bucket.
-- Re-running this file keeps existing rows.

create table if not exists public.staging_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  tags text[] not null,
  challenge text not null,
  solution text not null,
  main_image_url text not null,
  detail_image_urls text[] not null
);

create table if not exists public.production_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  tags text[] not null,
  challenge text not null,
  solution text not null,
  main_image_url text not null,
  detail_image_urls text[] not null
);

-- Keeps an older run of this file working: one detail_image_url becomes detail_image_urls.
alter table public.staging_projects add column if not exists updated_at timestamptz not null default now();
alter table public.production_projects add column if not exists updated_at timestamptz not null default now();
alter table public.staging_projects add column if not exists detail_image_urls text[];
alter table public.production_projects add column if not exists detail_image_urls text[];

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staging_projects'
      and column_name = 'detail_image_url'
  ) then
    update public.staging_projects
    set detail_image_urls = array[detail_image_url]
    where detail_image_url is not null
      and (detail_image_urls is null or cardinality(detail_image_urls) = 0);
    alter table public.staging_projects drop column detail_image_url;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'production_projects'
      and column_name = 'detail_image_url'
  ) then
    update public.production_projects
    set detail_image_urls = array[detail_image_url]
    where detail_image_url is not null
      and (detail_image_urls is null or cardinality(detail_image_urls) = 0);
    alter table public.production_projects drop column detail_image_url;
  end if;
end $$;

alter table public.staging_projects alter column detail_image_urls set not null;
alter table public.production_projects alter column detail_image_urls set not null;

create or replace function public.touch_project_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists staging_projects_set_updated_at on public.staging_projects;
create trigger staging_projects_set_updated_at
  before update on public.staging_projects
  for each row
  execute function public.touch_project_updated_at();

drop trigger if exists production_projects_set_updated_at on public.production_projects;
create trigger production_projects_set_updated_at
  before update on public.production_projects
  for each row
  execute function public.touch_project_updated_at();

alter table public.staging_projects enable row level security;
alter table public.production_projects enable row level security;

grant select on public.staging_projects to anon, authenticated;
grant select on public.production_projects to anon, authenticated;
grant insert on public.staging_projects to authenticated;
grant insert on public.production_projects to authenticated;

drop policy if exists "anyone can read staging projects" on public.staging_projects;
create policy "anyone can read staging projects"
  on public.staging_projects
  for select
  to anon, authenticated
  using (true);

drop policy if exists "anyone can read production projects" on public.production_projects;
create policy "anyone can read production projects"
  on public.production_projects
  for select
  to anon, authenticated
  using (true);

drop policy if exists "authenticated can insert staging projects" on public.staging_projects;
create policy "authenticated can insert staging projects"
  on public.staging_projects
  for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated can insert production projects" on public.production_projects;
create policy "authenticated can insert production projects"
  on public.production_projects
  for insert
  to authenticated
  with check (true);

insert into storage.buckets (id, name, public, file_size_limit)
values ('project-images', 'project-images', true, 5242880)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "anyone can read project images" on storage.objects;
create policy "anyone can read project images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "authenticated can upload project images" on storage.objects;
create policy "authenticated can upload project images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'project-images');

drop policy if exists "authenticated can delete project images" on storage.objects;
create policy "authenticated can delete project images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'project-images');
