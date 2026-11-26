  -- Whole database. Run once in the Supabase SQL Editor.
  -- Re-running this file keeps existing rows.
  -- Local and Vercel Preview use the staging_* tables.
  -- Vercel Production uses the production_* tables.

  -- ---------------------------------------------------------------------------
  -- Showcase projects
  -- Visitors may read rows. Signed-in back-office users may insert, update, and delete.
  -- Images and videos go in the public project-images bucket (50 MB cap; Free plan).
  -- ---------------------------------------------------------------------------

  create table if not exists public.staging_projects (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    name text not null, 
    category text not null,
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
    category text not null,
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
  -- Top-level category: digital_tools | service | website_designs | platform_creation
  alter table public.staging_projects add column if not exists category text;
  alter table public.production_projects add column if not exists category text;
  update public.staging_projects
  set category = 'website_designs'
  where category is null or category = '';
  update public.production_projects
  set category = 'website_designs'
  where category is null or category = '';
  alter table public.staging_projects alter column category set not null;
  alter table public.production_projects alter column category set not null;

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

  -- Popup sheet. Re-running this file keeps existing rows; new columns start empty.
  alter table public.staging_projects add column if not exists subtitle text not null default '';
  alter table public.production_projects add column if not exists subtitle text not null default '';
  alter table public.staging_projects add column if not exists features jsonb not null default '[]'::jsonb;
  alter table public.production_projects add column if not exists features jsonb not null default '[]'::jsonb;
  alter table public.staging_projects add column if not exists why_it text not null default '';
  alter table public.production_projects add column if not exists why_it text not null default '';
  alter table public.staging_projects add column if not exists how_we_help text not null default '';
  alter table public.production_projects add column if not exists how_we_help text not null default '';
  alter table public.staging_projects add column if not exists cta_text text not null default '';
  alter table public.production_projects add column if not exists cta_text text not null default '';
  alter table public.staging_projects add column if not exists footer_text text not null default '';
  alter table public.production_projects add column if not exists footer_text text not null default '';

  -- Optional Chinese copy. Empty means the website shows the English field.
  alter table public.staging_projects add column if not exists name_zh text not null default '';
  alter table public.production_projects add column if not exists name_zh text not null default '';
  alter table public.staging_projects add column if not exists subtitle_zh text not null default '';
  alter table public.production_projects add column if not exists subtitle_zh text not null default '';
  alter table public.staging_projects add column if not exists why_it_zh text not null default '';
  alter table public.production_projects add column if not exists why_it_zh text not null default '';
  alter table public.staging_projects add column if not exists how_we_help_zh text not null default '';
  alter table public.production_projects add column if not exists how_we_help_zh text not null default '';
  alter table public.staging_projects add column if not exists cta_text_zh text not null default '';
  alter table public.production_projects add column if not exists cta_text_zh text not null default '';
  alter table public.staging_projects add column if not exists footer_text_zh text not null default '';
  alter table public.production_projects add column if not exists footer_text_zh text not null default '';

  -- Optional link to the project's own landing page. Empty hides the Visit Site row.
  alter table public.staging_projects add column if not exists landing_url text not null default '';
  alter table public.production_projects add column if not exists landing_url text not null default '';
  alter table public.staging_projects drop column if exists landing_label;
  alter table public.production_projects drop column if exists landing_label;
  alter table public.staging_projects drop column if exists landing_label_zh;
  alter table public.production_projects drop column if exists landing_label_zh;

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

  grant insert, update on public.staging_projects to authenticated;
  grant insert, update on public.production_projects to authenticated;
  grant insert, delete on public.staging_projects to authenticated;
  grant insert, delete on public.production_projects to authenticated;

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

  drop policy if exists "authenticated can update staging projects" on public.staging_projects;
  create policy "authenticated can update staging projects"
    on public.staging_projects
    for update
    to authenticated
    using (true)
    with check (true);

  drop policy if exists "authenticated can update production projects" on public.production_projects;
  create policy "authenticated can update production projects"
    on public.production_projects
    for update
    to authenticated
    using (true)
    with check (true);

  drop policy if exists "authenticated can delete staging projects" on public.staging_projects;
  create policy "authenticated can delete staging projects"
    on public.staging_projects
    for delete
    to authenticated
    using (true);

  drop policy if exists "authenticated can delete production projects" on public.production_projects;
  create policy "authenticated can delete production projects"
    on public.production_projects
    for delete
    to authenticated
    using (true);

  insert into storage.buckets (id, name, public, file_size_limit)
  values ('project-images', 'project-images', true, 52428800)
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

  -- ---------------------------------------------------------------------------
  -- Contact form submissions
  -- Visitors may insert only. They cannot read, update, or delete rows.
  -- Signed-in back-office users may select rows.
  -- ---------------------------------------------------------------------------

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

  -- ---------------------------------------------------------------------------
  -- Contact icons (WhatsApp, Telegram, Facebook, Instagram)
  -- Visitors may read the row. Signed-in back-office users may update it.
  -- ---------------------------------------------------------------------------

  create table if not exists public.staging_contact_links (
    id int primary key default 1 check (id = 1),
    whatsapp text not null default '',
    telegram text not null default '',
    facebook text not null default '',
    instagram text not null default '',
    updated_at timestamptz not null default now()
  );

  create table if not exists public.production_contact_links (
    id int primary key default 1 check (id = 1),
    whatsapp text not null default '',
    telegram text not null default '',
    facebook text not null default '',
    instagram text not null default '',
    updated_at timestamptz not null default now()
  );

  insert into public.staging_contact_links (id, whatsapp, telegram, facebook, instagram)
  values (
    1,
    'https://wa.me/601112172475',
    'https://t.me/visioncraftofficial',
    'https://www.facebook.com/profile.php?id=61595156267766',
    'https://www.instagram.com/visioncraftt.cn/'
  )
  on conflict (id) do nothing;

  insert into public.production_contact_links (id, whatsapp, telegram, facebook, instagram)
  values (
    1,
    'https://wa.me/601112172475',
    'https://t.me/visioncraftofficial',
    'https://www.facebook.com/profile.php?id=61595156267766',
    'https://www.instagram.com/visioncraftt.cn/'
  )
  on conflict (id) do nothing;

  alter table public.staging_contact_links enable row level security;
  alter table public.production_contact_links enable row level security;

  grant select on public.staging_contact_links to anon, authenticated;
  grant select on public.production_contact_links to anon, authenticated;
  grant insert, update on public.staging_contact_links to authenticated;
  grant insert, update on public.production_contact_links to authenticated;

  drop policy if exists "anyone can read staging contact links" on public.staging_contact_links;
  create policy "anyone can read staging contact links"
    on public.staging_contact_links
    for select
    to anon, authenticated
    using (true);

  drop policy if exists "anyone can read production contact links" on public.production_contact_links;
  create policy "anyone can read production contact links"
    on public.production_contact_links
    for select
    to anon, authenticated
    using (true);

  drop policy if exists "authenticated can insert staging contact links" on public.staging_contact_links;
  create policy "authenticated can insert staging contact links"
    on public.staging_contact_links
    for insert
    to authenticated
    with check (true);

  drop policy if exists "authenticated can insert production contact links" on public.production_contact_links;
  create policy "authenticated can insert production contact links"
    on public.production_contact_links
    for insert
    to authenticated
    with check (true);

  drop policy if exists "authenticated can update staging contact links" on public.staging_contact_links;
  create policy "authenticated can update staging contact links"
    on public.staging_contact_links
    for update
    to authenticated
    using (true)
    with check (true);

  drop policy if exists "authenticated can update production contact links" on public.production_contact_links;
  create policy "authenticated can update production contact links"
    on public.production_contact_links
    for update
    to authenticated
    using (true)
    with check (true);
