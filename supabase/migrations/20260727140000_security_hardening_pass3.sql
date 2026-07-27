-- Security hardening pass 3 (secure-me audit follow-up):
--
-- 1. `fans` had a single `for select using (true)` policy ("handles are
--    public") granted to anon+authenticated. RLS is row-level, so this
--    exposed EVERY column of EVERY fan to anyone — including `ban_reason`
--    (moderator-written text), `current_streak`/`longest_streak`/
--    `last_active_date`, regardless of the fan's `public_profile` opt-in.
--    Fix: replace it with (self row) OR (admin) policies, and move the
--    legitimate cross-fan reads (comment-author handles, the public fan
--    directory, public-profile badge stats) onto narrow security-definer
--    functions that expose only the intentionally-public columns.
--
-- 2. The only non-admin UPDATE policy on `fans` ("a fan can rename
--    themselves") didn't restrict which columns a self-update could touch,
--    so a fan could PATCH their own row directly and forge
--    banned/ban_reason/streak/last_active_date. Fix: a trigger that reverts
--    those columns to their prior value unless the caller is an admin or
--    the write comes from the trusted internal path (record_fan_activity).

-- ---------------------------------------------------------------------------
-- 1a. Narrow direct SELECT access to `fans` to (self) OR (admin).
-- ---------------------------------------------------------------------------

drop policy if exists "handles are public" on public.fans;

create policy "a fan can view their own row"
  on public.fans for select
  to authenticated
  using (auth.uid () = id);

create policy "admins can view all fans"
  on public.fans for select
  to authenticated
  using (public.is_admin ());

-- No policy applies to `anon` anymore for direct table access — cross-fan
-- public reads go through the security-definer functions below instead,
-- which don't need (and shouldn't rely on) a table-level grant.
revoke select on public.fans from anon;

-- ---------------------------------------------------------------------------
-- 1b. Security-definer helpers for the legitimate cross-fan read paths.
-- ---------------------------------------------------------------------------

-- Used by the favorites/playlist_items "public ... are visible" policies
-- below instead of an inline EXISTS against `fans` — an inline EXISTS would
-- itself be subject to fans' (now-narrow) RLS and always evaluate false for
-- anyone but the fan themselves or an admin.
create or replace function public.fan_is_public (p_fan_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.fans
    where id = p_fan_id and public_profile = true and banned = false
  );
$$;

grant execute on function public.fan_is_public (uuid) to anon, authenticated;

-- Comment authorship: handles are intentionally public for every commenter
-- (opted into public_profile or not) — but nothing else about the fan.
create or replace function public.comment_authors (fan_ids uuid[])
returns table (id uuid, handle text)
language sql
stable
security definer
set search_path = public
as $$
  select f.id, f.handle
  from public.fans f
  where f.id = any (fan_ids);
$$;

grant execute on function public.comment_authors (uuid[]) to anon, authenticated;

-- Public fan directory / public-profile pages: only opted-in, unbanned
-- fans, and only the columns their profile page actually shows.
create or replace function public.public_fan_profiles ()
returns table (
  id uuid,
  handle text,
  created_at timestamptz,
  longest_streak integer
)
language sql
stable
security definer
set search_path = public
as $$
  select f.id, f.handle, f.created_at, f.longest_streak
  from public.fans f
  where f.public_profile = true and f.banned = false;
$$;

grant execute on function public.public_fan_profiles () to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 1c. Re-point the public_profiles.sql EXISTS-based policies at fan_is_public
--     so they don't silently break once `fans` SELECT is narrowed above.
-- ---------------------------------------------------------------------------

drop policy if exists "public favorites are visible" on public.favorites;
create policy "public favorites are visible"
  on public.favorites for select
  to anon, authenticated
  using (public.fan_is_public (fan_id));

drop policy if exists "public playlists are visible" on public.playlist_items;
create policy "public playlists are visible"
  on public.playlist_items for select
  to anon, authenticated
  using (public.fan_is_public (playlist_items.fan_id));

-- ---------------------------------------------------------------------------
-- 2. Block direct self-writes to privileged columns.
-- ---------------------------------------------------------------------------

create or replace function public.protect_fan_privileged_columns ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Set by record_fan_activity() (and any future trusted internal path)
  -- immediately before it writes streak fields for the calling fan.
  if coalesce(current_setting('app.trusted_fan_write', true), '') = 'on' then
    return new;
  end if;

  if public.is_admin () then
    return new;
  end if;

  new.banned := old.banned;
  new.ban_reason := old.ban_reason;
  new.current_streak := old.current_streak;
  new.longest_streak := old.longest_streak;
  new.last_active_date := old.last_active_date;
  return new;
end;
$$;

drop trigger if exists fans_protect_privileged_columns on public.fans;
create trigger fans_protect_privileged_columns
  before update on public.fans
  for each row
  execute function public.protect_fan_privileged_columns ();

-- record_fan_activity() legitimately writes current_streak/longest_streak/
-- last_active_date for the calling fan's own row — bless that specific
-- write via the transaction-local flag the trigger checks above.
create or replace function public.record_fan_activity ()
returns table (current_streak integer, longest_streak integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_last date;
  v_streak integer;
  v_longest integer;
begin
  select f.last_active_date, f.current_streak, f.longest_streak
    into v_last, v_streak, v_longest
    from public.fans f
    where f.id = auth.uid ()
      and f.banned = false;

  if not found then
    return;
  end if;

  if v_last = current_date then
    return query select v_streak, v_longest;
    return;
  elsif v_last = current_date - 1 then
    v_streak := v_streak + 1;
  else
    v_streak := 1;
  end if;

  if v_streak > v_longest then
    v_longest := v_streak;
  end if;

  perform set_config('app.trusted_fan_write', 'on', true);

  update public.fans f
  set current_streak = v_streak,
      longest_streak = v_longest,
      last_active_date = current_date
  where f.id = auth.uid ();

  perform set_config('app.trusted_fan_write', 'off', true);

  return query select v_streak, v_longest;
end;
$$;

grant execute on function public.record_fan_activity () to authenticated;
