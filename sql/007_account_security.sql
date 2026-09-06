begin;
-- Preserve valid existing team links in server-controlled Auth metadata.
update auth.users u
set raw_app_meta_data = coalesce(u.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('employee_id', t.id)
from public.team_members t, public.profiles p
where p.id = u.id and t.id = u.raw_user_meta_data ->> 'employee_id'
  and not (coalesce(u.raw_app_meta_data, '{}'::jsonb) ? 'employee_id');

create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.role() in ('anon', 'authenticated') then
    if tg_op = 'INSERT' and (new.role in ('admin', 'manager') or new.is_active = false) then
      raise exception 'Only the server may set account permissions';
    end if;
    if tg_op = 'UPDATE' and (new.role is distinct from old.role or new.is_active is distinct from old.is_active) then
      raise exception 'Only the server may change account permissions';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role before insert or update on public.profiles
for each row execute function public.protect_profile_role();
-- Account deletion/recreation must go through the admin API, not the user's token.
drop policy if exists own_write on public.profiles;
drop policy if exists own_profile_update on public.profiles;
create policy own_profile_update on public.profiles for update to authenticated
using (auth.uid() = id and is_active = true) with check (auth.uid() = id and is_active = true);
commit;
