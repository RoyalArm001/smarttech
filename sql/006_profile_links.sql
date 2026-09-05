begin;
alter table public.profiles
  add column if not exists website text not null default '',
  add column if not exists social_links jsonb not null default '{}'::jsonb;
notify pgrst, 'reload schema';
commit;
