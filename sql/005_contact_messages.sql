create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (char_length(phone) between 8 and 40),
  email text not null default '' check (char_length(email) <= 254),
  message text not null check (char_length(message) between 10 and 4000),
  status text not null default 'new' check (status in ('new', 'read', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc, id);
alter table public.contact_messages enable row level security;
revoke all on public.contact_messages from anon, authenticated;
grant select, insert, update, delete on public.contact_messages to service_role;
-- No public policies: all access goes through the server's validated endpoints.
notify pgrst, 'reload schema';
