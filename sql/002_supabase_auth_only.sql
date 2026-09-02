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
