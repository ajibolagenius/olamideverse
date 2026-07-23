-- Fan Zone reliability pass (2026-07-23)
--   1. poll_results as security_definer aggregates (public tallies without exposing voters)
--   2. Admin SELECT on favorites / playlist_items (moderation inventory)
--   3. DELETE grants for fans + poll_votes (policies existed; PostgREST lacked GRANT)
--   4. Block banned fans from writes at RLS
--   5. Allow fans to change their poll vote (UPDATE)

-- ---------------------------------------------------------------------------
-- 1. Public poll aggregates — bypass per-row vote RLS without leaking voters
-- ---------------------------------------------------------------------------

drop view if exists public.poll_results;

create or replace function public.get_poll_results(p_poll_id text default null)
returns table (poll_id text, option_id text, votes integer)
language sql
stable
security definer
set search_path = public
as $$
  select pv.poll_id, pv.option_id, count(*)::integer as votes
  from public.poll_votes pv
  where p_poll_id is null or pv.poll_id = p_poll_id
  group by pv.poll_id, pv.option_id;
$$;

grant execute on function public.get_poll_results (text) to anon, authenticated;

-- View uses owner privileges (security_invoker = false) so aggregates are
-- public without exposing individual voters through RLS on poll_votes.
create view public.poll_results
with (security_invoker = false) as
select poll_id, option_id, count(*)::integer as votes
from public.poll_votes
group by poll_id, option_id;

grant select on public.poll_results to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Admin read aggregates for favorites / playlists
-- ---------------------------------------------------------------------------

drop policy if exists "admins can read all favorites" on public.favorites;
create policy "admins can read all favorites"
  on public.favorites for select
  to authenticated
  using (public.is_admin ());

drop policy if exists "admins can read all playlist items" on public.playlist_items;
create policy "admins can read all playlist items"
  on public.playlist_items for select
  to authenticated
  using (public.is_admin ());

-- ---------------------------------------------------------------------------
-- 3. Missing DELETE grants (policies already in admin_cms)
-- ---------------------------------------------------------------------------

grant delete on public.fans to authenticated;
grant delete on public.poll_votes to authenticated;
grant update on public.poll_votes to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Ban enforcement at RLS — writes require an active (non-banned) fan row
-- ---------------------------------------------------------------------------

create or replace function public.fan_is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.fans
    where id = auth.uid()
      and banned = false
  );
$$;

grant execute on function public.fan_is_active () to authenticated;

-- Favorites
drop policy if exists "a fan manages only their own favorites" on public.favorites;
create policy "a fan manages only their own favorites"
  on public.favorites for all
  to authenticated
  using (auth.uid () = fan_id and public.fan_is_active ())
  with check (auth.uid () = fan_id and public.fan_is_active ());

-- Poll votes (select stays own-vote only; insert/update require active)
drop policy if exists "a fan can vote once per poll" on public.poll_votes;
create policy "a fan can vote once per poll"
  on public.poll_votes for insert
  to authenticated
  with check (auth.uid () = fan_id and public.fan_is_active ());

drop policy if exists "a fan can change their vote" on public.poll_votes;
create policy "a fan can change their vote"
  on public.poll_votes for update
  to authenticated
  using (auth.uid () = fan_id and public.fan_is_active ())
  with check (auth.uid () = fan_id and public.fan_is_active ());

-- Comments
drop policy if exists "a signed-in fan can comment as themselves" on public.comments;
create policy "a signed-in fan can comment as themselves"
  on public.comments for insert
  to authenticated
  with check (auth.uid () = fan_id and public.fan_is_active ());

drop policy if exists "a fan can delete their own comment" on public.comments;
create policy "a fan can delete their own comment"
  on public.comments for delete
  to authenticated
  using (auth.uid () = fan_id and public.fan_is_active ());

-- Hide comments from banned fans for public readers (admins still see via is_admin path)
drop policy if exists "comments are public" on public.comments;
create policy "comments are public"
  on public.comments for select
  to anon, authenticated
  using (
    public.is_admin ()
    or exists (
      select 1
      from public.fans f
      where f.id = comments.fan_id
        and f.banned = false
    )
  );

-- Playlist
drop policy if exists "a fan manages only their own playlist" on public.playlist_items;
create policy "a fan manages only their own playlist"
  on public.playlist_items for all
  to authenticated
  using (auth.uid () = fan_id and public.fan_is_active ())
  with check (auth.uid () = fan_id and public.fan_is_active ());

-- Fan self-update: banned fans cannot rename themselves
drop policy if exists "a fan can rename themselves" on public.fans;
create policy "a fan can rename themselves"
  on public.fans for update
  to authenticated
  using (auth.uid () = id and banned = false)
  with check (auth.uid () = id and banned = false);

-- Reports from active fans only
drop policy if exists "fans can file reports" on public.fan_reports;
create policy "fans can file reports"
  on public.fan_reports for insert
  to authenticated
  with check (auth.uid () = reporter_fan_id and public.fan_is_active ());
