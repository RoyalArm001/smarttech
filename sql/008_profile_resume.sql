begin;
alter table public.profiles
  add column if not exists resume jsonb not null default '{}'::jsonb
  check (jsonb_typeof(resume) = 'object');
comment on column public.profiles.resume is 'Public professional profile sections by language; editable by the account owner under existing profile RLS.';
notify pgrst, 'reload schema';
commit;
