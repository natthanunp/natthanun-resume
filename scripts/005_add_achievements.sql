begin;

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  category text not null check (category in ('Speaking', 'Conference', 'Award', 'Community')),
  description text not null check (char_length(btrim(description)) between 1 and 2000),
  event_date date,
  event_url text check (event_url is null or (char_length(event_url) <= 2048 and event_url ~ '^https?://')),
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists achievements_order_idx on public.achievements (order_index, created_at, id);
alter table public.achievements enable row level security;
grant select on public.achievements to anon, authenticated;
grant insert, update, delete on public.achievements to authenticated;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'achievements' and policyname = 'achievements_read') then
    create policy achievements_read on public.achievements for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'achievements' and policyname = 'achievements_insert') then
    create policy achievements_insert on public.achievements for insert to authenticated with check (auth.uid() is not null);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'achievements' and policyname = 'achievements_update') then
    create policy achievements_update on public.achievements for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'achievements' and policyname = 'achievements_delete') then
    create policy achievements_delete on public.achievements for delete to authenticated using (auth.uid() is not null);
  end if;
end $$;

create or replace function public.reorder_achievements(ordered_ids uuid[])
returns void language plpgsql security invoker set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if ordered_ids is null
    or array_position(ordered_ids, null) is not null
    or cardinality(ordered_ids) <> (select count(*) from public.achievements)
    or cardinality(ordered_ids) <> (select count(distinct id) from unnest(ordered_ids) as items(id))
    or exists (select 1 from unnest(ordered_ids) as items(id) where not exists (select 1 from public.achievements a where a.id = items.id)) then
    raise exception 'Achievement list changed. Refresh and try again.' using errcode = '22023';
  end if;

  update public.achievements a
  set order_index = items.position - 1, updated_at = now()
  from unnest(ordered_ids) with ordinality as items(id, position)
  where a.id = items.id;
end $$;

revoke all on function public.reorder_achievements(uuid[]) from public, anon;
grant execute on function public.reorder_achievements(uuid[]) to authenticated;

-- Existing highlights supplied by the portfolio owner; no event dates or URLs were provided.
insert into public.achievements (id, title, category, description, order_index) values
('aa010000-0000-4000-8000-000000000001', 'Thailand Flutter Meetup Speaker', 'Speaking',
 'Delivered presentations at Thailand Flutter Meetup events, sharing knowledge and best practices with the Flutter developer community.', 0),
('aa010000-0000-4000-8000-000000000002', 'JavaScript Bangkok 2.0 Showcase', 'Conference',
 'Showcased development of a simple shooting game in XR using Three.js, demonstrating expertise in web-based XR development.', 1)
on conflict (id) do nothing;

notify pgrst, 'reload schema';
commit;
