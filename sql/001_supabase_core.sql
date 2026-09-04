create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_path text,
  avatar_url text,
  bio text,
  phone text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.team_members (
  id text primary key,
  display_order integer not null default 0,
  department text, role_level text, manager_id text, title text, text text,
  accent text, color text, email text, image_path text, cover_image_path text,
  focus jsonb not null default '[]'::jsonb, socials jsonb not null default '[]'::jsonb,
  certificates jsonb not null default '[]'::jsonb, source_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.projects (
  id text primary key, title text not null,
  status text not null default 'current' check (status in ('current','partial','completed')),
  progress smallint not null default 0 check (progress between 0 and 100), phase text,
  display_order integer not null default 0,
  featured boolean not null default false, works jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb, system_images jsonb not null default '[]'::jsonb,
  sector jsonb, translations jsonb, source_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.project_members (
  project_id text not null references public.projects(id) on delete cascade,
  team_member_id text not null references public.team_members(id) on delete cascade,
  role text, primary key (project_id, team_member_id)
);
create table if not exists public.content_collections (
  id text primary key, payload jsonb not null default '{}'::jsonb, is_public boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null, updated_at timestamptz not null default now()
);
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(), bucket_id text not null, storage_path text not null,
  original_name text, mime_type text, size_bytes bigint, metadata jsonb not null default '{}'::jsonb,
  owner_id uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), unique(bucket_id, storage_path)
);

alter table public.profiles enable row level security;
alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.content_collections enable row level security;
alter table public.media_assets enable row level security;

do $$ declare t text; begin
  foreach t in array array['profiles','team_members','projects','project_members','content_collections','media_assets'] loop
    execute format('drop policy if exists public_read on public.%I', t);
    execute format('drop policy if exists own_read on public.%I', t);
    execute format('drop policy if exists own_write on public.%I', t);
  end loop;
end $$;
create policy public_read on public.team_members for select to anon, authenticated using (true);
create policy public_read on public.projects for select to anon, authenticated using (true);
create policy public_read on public.project_members for select to anon, authenticated using (true);
create policy public_read on public.content_collections for select to anon, authenticated using (is_public = true);
create policy own_read on public.profiles for select to authenticated using (auth.uid() = id);
create policy own_write on public.profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy public_read on public.media_assets for select to anon, authenticated using (bucket_id in ('avatars','project-images'));
create policy own_write on public.media_assets for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
