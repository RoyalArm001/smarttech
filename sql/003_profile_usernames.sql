alter table if exists public.profiles
  add column if not exists username text,
  add column if not exists is_active boolean not null default true;

update public.profiles
set role = 'member'
where role = 'user';

alter table if exists public.profiles
  drop constraint if exists profiles_role_check,
  alter column role set default 'member';

alter table if exists public.profiles
  add constraint profiles_role_check
  check (role in ('member', 'manager', 'admin'));

create unique index if not exists profiles_username_unique
  on public.profiles (lower(username))
  where username is not null;
