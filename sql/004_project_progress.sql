alter table public.projects
  add column if not exists progress smallint not null default 0,
  add column if not exists phase text;

update public.projects
set progress = case
  when status = 'completed' then 100
  when coalesce(source_data ->> 'progress', '') ~ '^\d{1,3}$'
    then greatest(0, least(100, (source_data ->> 'progress')::integer))
  else progress
end,
phase = coalesce(nullif(source_data ->> 'phase', ''), phase);

alter table public.projects drop constraint if exists projects_status_check;
alter table public.projects drop constraint if exists projects_progress_check;
alter table public.projects
  add constraint projects_status_check check (status in ('current', 'partial', 'completed')),
  add constraint projects_progress_check check (progress between 0 and 100);

notify pgrst, 'reload schema';
