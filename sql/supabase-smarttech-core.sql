create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  username text,
  role text not null default 'member' check (role in ('member','admin','manager')),
  avatar_url text,
  phone text,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_username_unique
  on public.profiles (lower(username))
  where username is not null;

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  title text,
  email text,
  phone text,
  avatar_url text,
  bio text,
  status text not null default 'active' check (status in ('active','inactive')),
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  status text not null default 'current' check (status in ('current','completed')),
  featured boolean not null default false,
  cover_image text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  slug text,
  title text not null,
  summary text,
  image text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  member_id uuid not null references public.team_members(id) on delete cascade,
  role text,
  created_at timestamptz not null default now(),
  unique (project_id, member_id)
);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  bucket text not null default 'project-files',
  storage_path text not null,
  public_url text not null,
  file_type text,
  file_name text,
  mime_type text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (project_id, storage_path)
);

alter table public.profiles enable row level security;
alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.project_members enable row level security;
alter table public.project_files enable row level security;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'authenticated' then
    if tg_op = 'INSERT' and new.role in ('admin', 'manager') then
      raise exception 'Only the server may grant elevated roles';
    end if;
    if tg_op = 'UPDATE' and new.role is distinct from old.role then
      raise exception 'Only the server may change account roles';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
before insert or update of role on public.profiles
for each row execute function public.protect_profile_role();

create trigger services_updated_at
before update on public.services
for each row execute function public.handle_updated_at();

create trigger team_members_updated_at
before update on public.team_members
for each row execute function public.handle_updated_at();

create trigger projects_updated_at
before update on public.projects
for each row execute function public.handle_updated_at();

create policy if not exists "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy if not exists "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy if not exists "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy if not exists "services_select_public"
on public.services
for select
using (true);

create policy if not exists "services_manage_admin"
on public.services
for all
using (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
)
with check (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
);

create policy if not exists "team_members_select_public"
on public.team_members
for select
using (true);

create policy if not exists "team_members_upsert_admin"
on public.team_members
for insert
with check (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
);

create policy if not exists "team_members_update_admin"
on public.team_members
for update
using (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
)
with check (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
);

create policy if not exists "team_members_delete_admin"
on public.team_members
for delete
using (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
);

create policy if not exists "projects_select_public"
on public.projects
for select
using (true);

create policy if not exists "projects_manage_admin"
on public.projects
for all
using (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
)
with check (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
);

create policy if not exists "project_members_select_public"
on public.project_members
for select
using (true);

create policy if not exists "project_members_manage_admin"
on public.project_members
for all
using (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
)
with check (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
);

create policy if not exists "project_files_select_public"
on public.project_files
for select
using (true);

create policy if not exists "project_files_manage_admin"
on public.project_files
for all
using (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
)
with check (
  auth.uid() is not null and (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','manager')
    )
  )
);

create or replace view public.user_profiles as
select * from public.profiles;
